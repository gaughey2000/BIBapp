// server/src/middleware/cors.js
import cors from "cors";
import { ENV } from "../config/env.js";

function normalize(u) {
  return (u || "").replace(/\/+$/, "");
}

// Whitelist: your deployed client + local dev
const ALLOW = new Set([
  normalize(ENV.CLIENT_URL),            // e.g. https://bibapp-lmpj.onrender.com
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

export const corsMiddleware = cors({
  origin(origin, cb) {
    // Non-browser requests (no Origin) — allow
    if (!origin) return cb(null, true);

    const o = normalize(origin);
    if (ALLOW.has(o)) return cb(null, true);

    // Block anything else (shows clearly in logs)
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true, // <-- allow cookies
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  maxAge: 86400,
  optionsSuccessStatus: 204, // some browsers are picky on 204 vs 200
});