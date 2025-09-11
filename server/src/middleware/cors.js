import cors from "cors";
import { ENV } from "../config/env.js";

export const corsMiddleware = cors({
  origin(origin, cb) {
    const allowList = [
      ENV.CLIENT_URL,                      
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ].filter(Boolean);
    if (!origin || allowList.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
});