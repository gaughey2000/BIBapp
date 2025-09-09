// server/src/middleware/cors.js
import cors from "cors";

const allowedOrigins = [
  process.env.CLIENT_URL,          // e.g. https://bibapp-lmpj.onrender.com
  "http://localhost:5173",         // dev
].filter(Boolean);

export const corsMiddleware = cors({
  origin(origin, callback) {
    // allow same-origin or server-to-server (no origin header)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin not allowed -> ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});