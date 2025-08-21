const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { PrismaClient } = require("@prisma/client");
const { DateTime } = require("luxon");
const {
  weekdayOf,
  toZonedDate,
  overlaps,
  generateCandidates
} = require("./availability");
const app = express();
const prisma = new PrismaClient();
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";
const crypto = require("crypto");
const { z } = require("zod");
const BOOKING_MIN_ADVANCE_MIN = 60;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "devsecret", { expiresIn: "2h" });
}

function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const payload = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

function isoToLondon(iso) {
    return DateTime.fromISO(iso, { zone: "utc" }).setZone("Europe/London");
  }

  async function hasConflict(prisma, startLondon, endLondon) {
    // compare against bookings + blackouts
    const startUTC = startLondon.toUTC().toJSDate();
    const endUTC = endLondon.toUTC().toJSDate();
  
    const [bookingClash, blackoutClash] = await Promise.all([
      prisma.booking.findFirst({
        where: {
          status: "confirmed",
          // overlap condition: (aStart < bEnd && bStart < aEnd)
          AND: [
            { starts_at: { lt: endUTC } },
            { ends_at: { gt: startUTC } }
          ]
        },
        select: { booking_id: true }
      }),
      prisma.blackoutSlot.findFirst({
        where: {
          AND: [
            { starts_at: { lt: endUTC } },
            { ends_at: { gt: startUTC } }
          ]
        },
        select: { id: true }
      })
    ]);
  
    return Boolean(bookingClash || blackoutClash);
  }

app.use(helmet());
app.use(cors({
  origin(origin, cb) {
    // allow mobile/SSR/no-origin tools too
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS blocked"));
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// basic rate limits
const bookingLimiter = rateLimit({ windowMs: 60_000, max: 30 });

app.get("/health", (_req, res) => res.json({ ok: true }));


// Public: list services
app.get("/api/services", async (_req, res) => {
  const services = await prisma.service.findMany({
    where: { is_active: true },
    orderBy: { service_id: "asc" }
  });
  res.json(services);
});

// placeholders for next steps
app.get("/api/availability", async (req, res) => {
    try {
      const serviceId = parseInt(req.query.serviceId, 10);
      const dateStr = req.query.date; // 'YYYY-MM-DD'
      if (!serviceId || !dateStr) {
        return res.status(400).json({ error: "serviceId and date are required" });
      }
  
      const service = await prisma.service.findUnique({ where: { service_id: serviceId } });
      if (!service || !service.is_active) {
        return res.status(404).json({ error: "Service not found" });
      }
  
      // Business hours
      const wday = weekdayOf(dateStr); // 0..6 Sun..Sat
      const hours = await prisma.businessHour.findFirst({ where: { weekday: wday } });
      if (!hours) return res.json([]); // closed that day
  
      const openDT = toZonedDate(dateStr, hours.open_time);   // Europe/London
      const closeDT = toZonedDate(dateStr, hours.close_time); // Europe/London
  
      // Generate candidate starts
      const candidates = generateCandidates(
        openDT,
        closeDT,
        service.duration_min,
        service.buffer_min
      );
  
      // Fetch all bookings + blackouts that touch this day
      // Compute day window in UTC
      const dayStartUTC = openDT.startOf("day").toUTC().toJSDate();
      const dayEndUTC = openDT.endOf("day").toUTC().toJSDate();
  
      const [bookings, blackouts] = await Promise.all([
        prisma.booking.findMany({
          where: {
            status: "confirmed",
            OR: [
              { starts_at: { gte: dayStartUTC, lt: dayEndUTC } },
              { ends_at:   { gt: dayStartUTC, lte: dayEndUTC } }
            ]
          },
          select: { starts_at: true, ends_at: true }
        }),
        prisma.blackoutSlot.findMany({
          where: {
            OR: [
              { starts_at: { gte: dayStartUTC, lt: dayEndUTC } },
              { ends_at:   { gt: dayStartUTC, lte: dayEndUTC } }
            ]
          },
          select: { starts_at: true, ends_at: true }
        })
      ]);
  
      // Build intervals for conflicts (in Europe/London for consistent compare)
      const bookingIntervals = bookings.map(b => ({
        start: DateTime.fromJSDate(b.starts_at).setZone("Europe/London"),
        end:   DateTime.fromJSDate(b.ends_at).setZone("Europe/London")
      }));
      const blackoutIntervals = blackouts.map(b => ({
        start: DateTime.fromJSDate(b.starts_at).setZone("Europe/London"),
        end:   DateTime.fromJSDate(b.ends_at).setZone("Europe/London")
      }));
  
      // Policy: no booking sooner than X minutes from now
      const MIN_ADVANCE_MIN = 60;
      const nowPlus = DateTime.now().setZone("Europe/London").plus({ minutes: MIN_ADVANCE_MIN });
  
      // Filter candidates
      const keep = candidates.filter(start => {
        const end = start.plus({ minutes: service.duration_min + service.buffer_min });
        if (start < nowPlus) return false;
        for (const iv of bookingIntervals) {
          if (overlaps(start, end, iv.start, iv.end)) return false;
        }
        for (const iv of blackoutIntervals) {
          if (overlaps(start, end, iv.start, iv.end)) return false;
        }
        return true;
      });
  
      // Return ISO strings in UTC (client can show local)
      const result = keep.map(dt => dt.toUTC().toISO());
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal error" });
    }
  });

  const BookingInput = z.object({
    service_id: z.number().int().positive(),
    client_name: z.string().min(2).max(120),
    client_email: z.string().email(),
    client_phone: z.string().min(6).max(30).optional(),
    starts_at: z.string().datetime() // ISO string, we expect UTC from client
  });

  app.post("/api/bookings", bookingLimiter, async (req, res) => {
    try {
      const parsed = BookingInput.safeParse({
        ...req.body,
        service_id: Number(req.body?.service_id)
      });
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
      }
      const { service_id, client_name, client_email, client_phone, starts_at } = parsed.data;
  
      // Load service
      const service = await prisma.service.findUnique({ where: { service_id } });
      if (!service || !service.is_active) {
        return res.status(404).json({ error: "Service not found" });
      }
  
      // Compute times in Europe/London for policy checks
      const startLondon = isoToLondon(starts_at);
      if (!startLondon.isValid) return res.status(400).json({ error: "Invalid starts_at" });
  
      // Minimum advance rule
      const earliest = DateTime.now().setZone("Europe/London").plus({ minutes: BOOKING_MIN_ADVANCE_MIN });
      if (startLondon < earliest) {
        return res.status(400).json({ error: `Bookings must be at least ${BOOKING_MIN_ADVANCE_MIN} minutes in advance` });
      }
  
      // Within business hours?
      const bh = await prisma.businessHour.findFirst({ where: { weekday: startLondon.weekday % 7 } });
      if (!bh) return res.status(400).json({ error: "Clinic is closed that day" });
  
      const dayStr = startLondon.toFormat("yyyy-LL-dd");
      const openDT = DateTime.fromISO(`${dayStr}T${bh.open_time}`, { zone: "Europe/London" });
      const closeDT = DateTime.fromISO(`${dayStr}T${bh.close_time}`, { zone: "Europe/London" });
  
      const endLondon = startLondon.plus({ minutes: service.duration_min + service.buffer_min });
      if (startLondon < openDT || endLondon > closeDT) {
        return res.status(400).json({ error: "Selected time is outside business hours" });
      }
  
      // Conflict check
      const clash = await hasConflict(prisma, startLondon, endLondon);
      if (clash) return res.status(409).json({ error: "Time slot no longer available" });
  
      // All good → create booking
      const cancel_token = crypto.randomBytes(24).toString("hex");
      const created = await prisma.booking.create({
        data: {
          service_id,
          client_name,
          client_email,
          client_phone: client_phone ?? null,
          starts_at: startLondon.toUTC().toJSDate(),
          ends_at: endLondon.toUTC().toJSDate(),
          cancel_token
        },
        select: {
          booking_id: true,
          cancel_token: true,
          starts_at: true,
          ends_at: true
        }
      });
  
      return res.status(201).json(created);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal error" });
    }
  });

  const CancelInput = z.object({
    cancel_token: z.string().min(10)
  });
  
app.post("/api/bookings/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;
    const parsed = CancelInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid cancel token" });
  
    const booking = await prisma.booking.findUnique({ where: { booking_id: id } });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.cancel_token !== parsed.data.cancel_token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (booking.status === "cancelled") {
      return res.status(200).json({ ok: true, message: "Already cancelled" });
    }
  
    await prisma.booking.update({
      where: { booking_id: id },
      data: { status: "cancelled" }
    });
  
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal error" });
  }
});


// Admin login (email + password)
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken({ user_id: user.user_id, role: user.role, email: user.email });

  // ✅ Important: send a JSON response after setting the cookie
  return res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,  // true in production (HTTPS)
      path: "/"
    })
    .json({ email: user.email });
});

// Who am I? (used by client to protect routes)
app.get("/api/auth/me", requireAdmin, (req, res) => {
  res.json({ email: req.user.email, role: req.user.role });
});

//Logout
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token").json({ ok: true });
});

// List bookings (week window optional)
app.get("/api/admin/bookings", requireAdmin, async (req, res) => {
  const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 7*24*60*60*1000);
  const to   = req.query.to   ? new Date(req.query.to)   : new Date(Date.now() + 14*24*60*60*1000);

  const rows = await prisma.booking.findMany({
    where: { starts_at: { gte: from }, ends_at: { lte: to } },
    orderBy: { starts_at: "asc" },
    select: {
      booking_id: true, status: true, starts_at: true, ends_at: true,
      client_name: true, client_email: true, client_phone: true,
      service: { select: { name: true } }
    }
  });
  res.json(rows);
});

// Admin cancel (no token required, since admin)
app.post("/api/admin/bookings/:id/cancel", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const found = await prisma.booking.findUnique({ where: { booking_id: id } });
  if (!found) return res.status(404).json({ error: "Not found" });
  if (found.status === "cancelled") return res.json({ ok: true, message: "Already cancelled" });

  await prisma.booking.update({ where: { booking_id: id }, data: { status: "cancelled" } });
  res.json({ ok: true });
});

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`API running → http://localhost:${PORT}`));

const BlackoutInput = z.object({
  starts_at: z.string().datetime(), // ISO (UTC or with TZ)
  ends_at: z.string().datetime(),
  reason: z.string().max(200).optional(),
});

// List blackouts (window)
app.get("/api/admin/blackouts", requireAdmin, async (req, res) => {
  const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 30*24*60*60*1000);
  const to   = req.query.to   ? new Date(req.query.to)   : new Date(Date.now() + 60*24*60*60*1000);

  const rows = await prisma.blackoutSlot.findMany({
    where: { starts_at: { lt: to }, ends_at: { gt: from } }, // any overlap with window
    orderBy: { starts_at: "asc" }
  });
  res.json(rows);
});

// Create a blackout block
app.post("/api/admin/blackouts", requireAdmin, async (req, res) => {
  const parsed = BlackoutInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });

  const starts = new Date(parsed.data.starts_at);
  const ends   = new Date(parsed.data.ends_at);
  if (!(starts < ends)) return res.status(400).json({ error: "ends_at must be after starts_at" });

  // Optional: prevent exact duplicates/huge ranges
  const MAX_DAYS = 30;
  if ((ends - starts) / (1000*60*60*24) > MAX_DAYS) {
    return res.status(400).json({ error: `Blackout cannot exceed ${MAX_DAYS} days` });
  }

  const created = await prisma.blackoutSlot.create({
    data: { starts_at: starts, ends_at: ends, reason: parsed.data.reason ?? null }
  });
  res.status(201).json(created);
});

// Delete a blackout
app.delete("/api/admin/blackouts/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

  await prisma.blackoutSlot.delete({ where: { id } }).catch(() => {});
  res.json({ ok: true });
});