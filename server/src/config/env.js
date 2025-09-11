// server/src/config/env.js
import 'dotenv/config';

const required = (name) => {
  const v = process.env[name];
  if (!v) throw new Error(`[ENV] Missing required env: ${name}`);
  return v;
};

const isProd = process.env.NODE_ENV === 'production';

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,

  // Render client origin (no trailing slash)
  CLIENT_URL: (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, ""),

  // Prisma uses DATABASE_URL directly
  DATABASE_URL: process.env.DATABASE_URL,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
};