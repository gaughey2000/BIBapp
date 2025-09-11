import { ENV } from "../config/env.js";

export const authCookieName = "token";

const isProd = ENV.NODE_ENV === "production";

export const authCookieOptions = {
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure:   isProd ? true : false,
  path: "/",
  maxAge: 60 * 60 * 2, // 2 hours
};