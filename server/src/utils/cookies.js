export const authCookieName = "token";

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",          
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: TWO_HOURS_MS,
};