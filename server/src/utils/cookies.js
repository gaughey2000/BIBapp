export const authCookieName = "token";

export const authCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 1000 * 60 * 60 * 2, // 2h
};