// server/src/middleware/rateLimiters.js
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,              // 5 attempts per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again shortly.' },
});

export const bookingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30, // example cap for booking endpoint
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests.' },
});