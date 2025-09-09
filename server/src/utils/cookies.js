export const authCookieOptions = {
  httpOnly: true,
  secure: ENV.isProd,
  sameSite: ENV.isProd ? "none" : "lax", 
  path: "/",
};