const isProd = process.env.NODE_ENV === "production";

export const authCookieName = "token";

export const authCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: isProd ? "none" : "lax",
  secure: isProd ? true : false,
  maxAge: 2 * 60 * 60, // seconds
};