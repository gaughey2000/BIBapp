import cors from 'cors';
import { ENV } from '../config/env.js';

const allowedOrigins = new Set([
  ...(ENV.isProd ? [ENV.CLIENT_URL] : [ENV.CLIENT_URL, ...ENV.DEV_ORIGINS]),
]);

export const corsMiddleware = cors({
  origin(origin, cb) {
    // allow same-origin / server-to-server / curl (no origin header)
    if (!origin) return cb(null, true);
    if (allowedOrigins.has(origin)) return cb(null, true);
    // deny without throwing (Express will not set ACAO and the browser will block)
    return cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});