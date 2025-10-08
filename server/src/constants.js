// server/src/constants.js
// Centralized constants for business logic

export const BookingStatus = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
};

export const BookingConfig = {
  MIN_ADVANCE_MINUTES: 60,
  MAX_BLACKOUT_DAYS: 30,
  SLOT_INTERVAL_MINUTES: 15,
};

export const TokenConfig = {
  JWT_EXPIRES_IN: '2h',
  COOKIE_MAX_AGE: 2 * 60 * 60, // 2 hours in seconds
};

export const RateLimits = {
  LOGIN_WINDOW_MS: 60 * 1000,       // 1 minute
  LOGIN_MAX_ATTEMPTS: 5,
  BOOKING_WINDOW_MS: 60 * 1000,     // 1 minute
  BOOKING_MAX_REQUESTS: 30,
};
