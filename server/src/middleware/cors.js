import cors from "cors";
import { ENV } from "../config/env.js";

const allowlist = new Set([
  (ENV.CLIENT_URL || "").replace(/\/+$/, ""),     
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

export const corsMiddleware = cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);

    const o = origin.replace(/\/+$/, "");
    if (allowlist.has(o)) return cb(null, true);

    return cb(null, false);
  },
  credentials: true, // required for cookie auth
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});