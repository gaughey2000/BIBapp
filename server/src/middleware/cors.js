import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
  "https://bibapp-lmpj.onrender.com", // Render FE
];

export const corsMiddleware = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow curl / server-side
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
});