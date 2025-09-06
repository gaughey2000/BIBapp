// server/src/config/env.js
import 'dotenv/config';

const required = (name) => {
  const v = process.env[name];
  if (!v) throw new Error(`[ENV] Missing required env: ${name}`);
  return v;
};

const isProd = process.env.NODE_ENV === 'production';

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),

  // MUST be set in production (will throw if prod and missing)
  CLIENT_URL: isProd ? required('CLIENT_URL') : (process.env.CLIENT_URL ?? 'http://localhost:5173'),
  JWT_SECRET: required('JWT_SECRET'),

  // DB may already be required elsewhere, keep it here for clarity
  DATABASE_URL: required('DATABASE_URL'),

  // CORS/local dev helpers
  DEV_ORIGINS: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  isProd,
};