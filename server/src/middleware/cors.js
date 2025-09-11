import cors from "cors";
import { ENV } from "../config/env.js";

const allowedOrigins = [
  ENV.CLIENT_URL,                        
  "http://localhost:5173",               
  "http://127.0.0.1:5173"                
].filter(Boolean);

export const corsMiddleware = cors({
  origin(origin, cb) {

    if (!origin) return cb(null, true);
    const ok = allowedOrigins.includes(origin);
    return cb(ok ? null : new Error(`CORS blocked: ${origin}`), ok);
  },
  credentials: true, 
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
});