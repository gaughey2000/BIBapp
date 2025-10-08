// server/src/middleware/rateLimiters.js
import rateLimit from 'express-rate-limit';
import { RateLimits } from '../constants.js';

export const loginLimiter = rateLimit({
  windowMs: RateLimits.LOGIN_WINDOW_MS,
  max: RateLimits.LOGIN_MAX_ATTEMPTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again shortly.' },
});

export const bookingLimiter = rateLimit({
  windowMs: RateLimits.BOOKING_WINDOW_MS,
  max: RateLimits.BOOKING_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests.' },
});