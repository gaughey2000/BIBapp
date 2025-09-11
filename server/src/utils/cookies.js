import { ENV } from "../config/env.js";

export const authCookieName = "token";

const isProd = ENV.NODE_ENV === "production";

export const authCookieOptions = {
  httpOnly: true,
  secure: isProd,               
  sameSite: isProd ? "none" : "lax",
  path: "/",
  maxAge: 2 * 60 * 60,      
};