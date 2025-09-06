// server/src/utils/cookies.js
import { ENV } from '../config/env.js';

export const authCookieName = 'token';

export const authCookieOptions = {
  httpOnly: true,
  secure: ENV.isProd,              // true on HTTPS (Render)
  sameSite: ENV.isProd ? 'lax' : 'lax',
  path: '/',
  // optional: set domain if you need cross-subdomain sharing
  // domain: ENV.isProd ? new URL(ENV.CLIENT_URL).hostname : undefined,
  // optional: set cookie lifetime (e.g., 2h)
  // maxAge: 2 * 60 * 60 * 1000,
};