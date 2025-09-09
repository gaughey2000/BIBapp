// server/src/utils/cookies.js
export const authCookieName = "token";

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

/**
 * In production on Render the client is on a different origin, so:
 *  - secure: true
 *  - sameSite: "none"
 * In dev, we can relax to lax.
 */
export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: TWO_HOURS_MS,
};