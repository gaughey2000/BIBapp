import cors from "cors";
import { ENV } from "../config/env.js";

const allowlist = new Set([
  ENV.CLIENT_URL,           
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

export const corsMiddleware = cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);

    const normalized = origin.replace(/\/+$/, "");
    if (allowlist.has(normalized)) return cb(null, true);

    return cb(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});