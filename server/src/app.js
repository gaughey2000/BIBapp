import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";

import { ENV } from "./config/env.js";
import { corsMiddleware } from "./middleware/cors.js";
import { authCookieName, authCookieOptions } from "./utils/cookies.js";
import { loginLimiter as loginGuard } from "./middleware/rateLimiters.js";
import { TokenConfig } from "./constants.js";

// ---- app & db (exported for tests) ----
export const app = express();
export const prisma = new PrismaClient({
  log: ENV.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Test database connection on startup
prisma.$connect()
  .then(() => console.log('✅ Database connected'))
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Trust Render/Cloudflare proxies
app.set("trust proxy", 1);

// ---- core middleware ----
app.use(helmet());

// Request logging (skip in tests)
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// CORS
app.use(corsMiddleware);
app.options(/^\/api\/.*$/, corsMiddleware);

app.use(express.json());
app.use(cookieParser());

// ---- helpers / security ----
function signToken(payload) {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: TokenConfig.JWT_EXPIRES_IN });
}

// read token from cookie OR Authorization header
function getTokenFromReq(req) {
  const cookieTok = req.cookies?.[authCookieName] || null;
  const auth = req.get("authorization") || "";
  const headerTok = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  return cookieTok || headerTok || null;
}

function requireAdmin(req, res, next) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const payload = jwt.verify(token, ENV.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// ============================================================
// HEALTH CHECK
// ============================================================
app.get("/health", async (_req, res) => {
  const checks = {
    server: 'ok',
    database: 'unknown',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: ENV.NODE_ENV,
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'ok';
    res.json(checks);
  } catch (err) {
    checks.database = 'error';
    checks.error = err.message;
    res.status(503).json(checks);
  }
});

// ============================================================
// PUBLIC ROUTES - Services
// ============================================================

// Get all active services (public)
app.get("/api/services", async (_req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { is_active: true },
      orderBy: [{ treatment_type: "asc" }, { name: "asc" }],
    });
    return res.json(services);
  } catch (err) {
    console.error("GET /api/services:", err);
    return res.status(500).json({ error: "Failed to fetch services" });
  }
});

// Get single service (public)
app.get("/api/services/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid service ID" });
    }
    const service = await prisma.service.findUnique({ where: { service_id: id } });
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    return res.json(service);
  } catch (err) {
    console.error("GET /api/services/:id:", err);
    return res.status(500).json({ error: "Failed to fetch service" });
  }
});

// ============================================================
// AUTH ROUTES
// ============================================================

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

app.post("/api/auth/login", loginGuard, async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = signToken({ userId: user.user_id, email: user.email });
    res.cookie(authCookieName, token, authCookieOptions);
    return res.json({ token, user: { email: user.email, role: user.role } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: err.errors });
    }
    console.error("POST /api/auth/login:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/auth/me", requireAdmin, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: req.user.userId },
      select: { email: true, role: true, created_at: true },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    console.error("GET /api/auth/me:", err);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie(authCookieName);
  return res.json({ ok: true });
});

// ============================================================
// ADMIN ROUTES - Service Management
// ============================================================

// Get all services (admin - includes inactive)
app.get("/api/admin/services", requireAdmin, async (_req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ treatment_type: "asc" }, { name: "asc" }],
    });
    return res.json(services);
  } catch (err) {
    console.error("GET /api/admin/services:", err);
    return res.status(500).json({ error: "Failed to fetch services" });
  }
});

// Create service
const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price_cents: z.number().int().min(0),
  duration_min: z.number().int().min(1),
  buffer_min: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
  more_info: z.string().optional(),
  treatment_type: z.enum([
    "BOTULINUM_TOXIN",
    "CHEMICAL_PEELS",
    "DERMAL_FILLER",
    "SKIN_CARE",
    "OTHER_SERVICES",
  ]).optional(),
});

app.post("/api/admin/services", requireAdmin, async (req, res) => {
  try {
    const data = serviceSchema.parse(req.body);
    const service = await prisma.service.create({ data });
    return res.status(201).json(service);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: err.errors });
    }
    console.error("POST /api/admin/services:", err);
    return res.status(500).json({ error: "Failed to create service" });
  }
});

// Update service
app.put("/api/admin/services/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid service ID" });
    }
    const data = serviceSchema.partial().parse(req.body);
    const service = await prisma.service.update({
      where: { service_id: id },
      data,
    });
    return res.json(service);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: err.errors });
    }
    console.error("PUT /api/admin/services/:id:", err);
    return res.status(500).json({ error: "Failed to update service" });
  }
});

// Delete service
app.delete("/api/admin/services/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid service ID" });
    }
    await prisma.service.delete({ where: { service_id: id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/services/:id:", err);
    return res.status(500).json({ error: "Failed to delete service" });
  }
});

// ============================================================
// FALLBACK
// ============================================================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
