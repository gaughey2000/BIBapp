import 'dotenv/config';
import { ENV } from './config/env.js';

import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { z } from 'zod';
import { DateTime } from 'luxon';

import { corsMiddleware } from './middleware/cors.js';
import { authCookieName, authCookieOptions } from './utils/cookies.js';
import { loginLimiter as loginGuard, bookingLimiter } from './middleware/rateLimiters.js';

// If availability.js lives at server/availability.js:
import { weekdayOf, toZonedDate, overlaps, generateCandidates } from './availability.js';

// ---- app & db ----
const app = express();
const prisma = new PrismaClient();

// ---- core middleware ----
app.use(helmet());
app.use(corsMiddleware);           // ✅ single source of truth for CORS
app.use(express.json());
app.use(cookieParser());

// ---- security: constants / helpers ----
const BOOKING_MIN_ADVANCE_MIN = 60;

function signToken(payload) {
  // ❗ no fallback dev secret
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '2h' });
}

function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.[authCookieName];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, ENV.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

function isoToLondon(iso) {
  return DateTime.fromISO(iso, { zone: 'utc' }).setZone('Europe/London');
}

async function hasConflict(prisma, startLondon, endLondon) {
  const startUTC = startLondon.toUTC().toJSDate();
  const endUTC = endLondon.toUTC().toJSDate();

  const [bookingClash, blackoutClash] = await Promise.all([
    prisma.booking.findFirst({
      where: {
        status: 'confirmed',
        AND: [{ starts_at: { lt: endUTC } }, { ends_at: { gt: startUTC } }],
      },
      select: { booking_id: true },
    }),
    prisma.blackoutSlot.findFirst({
      where: {
        AND: [{ starts_at: { lt: endUTC } }, { ends_at: { gt: startUTC } }],
      },
      select: { id: true },
    }),
  ]);

  return Boolean(bookingClash || blackoutClash);
}

// ---- health ----
app.get('/health', (_req, res) => res.json({ ok: true }));

// ---- services ----
app.get('/api/services', async (_req, res) => {
  const services = await prisma.service.findMany({
    where: { is_active: true },
    orderBy: { service_id: 'asc' },
  });
  res.json(services);
});

app.get('/api/services/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid service id' });
  }
  const s = await prisma.service.findUnique({ where: { service_id: id } });
  if (!s || !s.is_active) return res.status(404).json({ error: 'Not found' });
  res.json(s);
});

// ---- availability ----
app.get('/api/availability', async (req, res) => {
  try {
    const serviceId = parseInt(req.query.serviceId, 10);
    const dateStr = req.query.date; // 'YYYY-MM-DD'
    if (!serviceId || !dateStr) {
      return res.status(400).json({ error: 'serviceId and date are required' });
    }

    const service = await prisma.service.findUnique({ where: { service_id: serviceId } });
    if (!service || !service.is_active) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const wday = weekdayOf(dateStr); // 0..6 Sun..Sat
    const hours = await prisma.businessHour.findFirst({ where: { weekday: wday } });
    if (!hours) return res.json([]); // closed that day

    const openDT = toZonedDate(dateStr, hours.open_time);   // Europe/London
    const closeDT = toZonedDate(dateStr, hours.close_time); // Europe/London

    const candidates = generateCandidates(
      openDT,
      closeDT,
      service.duration_min,
      service.buffer_min
    );

    const dayStartUTC = openDT.startOf('day').toUTC().toJSDate();
    const dayEndUTC = openDT.endOf('day').toUTC().toJSDate();

    const [bookings, blackouts] = await Promise.all([
      prisma.booking.findMany({
        where: {
          status: 'confirmed',
          OR: [
            { starts_at: { gte: dayStartUTC, lt: dayEndUTC } },
            { ends_at: { gt: dayStartUTC, lte: dayEndUTC } },
          ],
        },
        select: { starts_at: true, ends_at: true },
      }),
      prisma.blackoutSlot.findMany({
        where: {
          OR: [
            { starts_at: { gte: dayStartUTC, lt: dayEndUTC } },
            { ends_at: { gt: dayStartUTC, lte: dayEndUTC } },
          ],
        },
        select: { starts_at: true, ends_at: true },
      }),
    ]);

    const bookingIntervals = bookings.map((b) => ({
      start: DateTime.fromJSDate(b.starts_at).setZone('Europe/London'),
      end: DateTime.fromJSDate(b.ends_at).setZone('Europe/London'),
    }));
    const blackoutIntervals = blackouts.map((b) => ({
      start: DateTime.fromJSDate(b.starts_at).setZone('Europe/London'),
      end: DateTime.fromJSDate(b.ends_at).setZone('Europe/London'),
    }));

    const nowPlus = DateTime.now().setZone('Europe/London').plus({ minutes: BOOKING_MIN_ADVANCE_MIN });

    const keep = candidates.filter((start) => {
      const end = start.plus({ minutes: service.duration_min + service.buffer_min });
      if (start < nowPlus) return false;
      for (const iv of bookingIntervals) {
        if (overlaps(start, end, iv.start, iv.end)) return false;
      }
      for (const iv of blackoutIntervals) {
        if (overlaps(start, end, iv.start, iv.end)) return false;
      }
      return true;
    });

    const result = keep.map((dt) => dt.toUTC().toISO());
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// ---- bookings ----
const BookingInput = z.object({
  service_id: z.number().int().positive(),
  client_name: z.string().min(2).max(120),
  client_email: z.string().email(),
  client_phone: z.string().min(6).max(30).optional(),
  starts_at: z.string().datetime(), // ISO string, expected UTC
});

app.post('/api/bookings', bookingLimiter, async (req, res) => {
  try {
    const parsed = BookingInput.safeParse({
      ...req.body,
      service_id: Number(req.body?.service_id),
    });
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    }
    const { service_id, client_name, client_email, client_phone, starts_at } = parsed.data;

    const service = await prisma.service.findUnique({ where: { service_id } });
    if (!service || !service.is_active) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const startLondon = isoToLondon(starts_at);
    if (!startLondon.isValid) return res.status(400).json({ error: 'Invalid starts_at' });

    const earliest = DateTime.now().setZone('Europe/London').plus({ minutes: BOOKING_MIN_ADVANCE_MIN });
    if (startLondon < earliest) {
      return res.status(400).json({ error: `Bookings must be at least ${BOOKING_MIN_ADVANCE_MIN} minutes in advance` });
    }

    const bh = await prisma.businessHour.findFirst({ where: { weekday: startLondon.weekday % 7 } });
    if (!bh) return res.status(400).json({ error: 'Clinic is closed that day' });

    const dayStr = startLondon.toFormat('yyyy-LL-dd');
    const openDT = DateTime.fromISO(`${dayStr}T${bh.open_time}`, { zone: 'Europe/London' });
    const closeDT = DateTime.fromISO(`${dayStr}T${bh.close_time}`, { zone: 'Europe/London' });

    const endLondon = startLondon.plus({ minutes: service.duration_min + service.buffer_min });
    if (startLondon < openDT || endLondon > closeDT) {
      return res.status(400).json({ error: 'Selected time is outside business hours' });
    }

    const clash = await hasConflict(prisma, startLondon, endLondon);
    if (clash) return res.status(409).json({ error: 'Time slot no longer available' });

    const cancel_token = crypto.randomBytes(24).toString('hex');
    const created = await prisma.booking.create({
      data: {
        service_id,
        client_name,
        client_email,
        client_phone: client_phone ?? null,
        starts_at: startLondon.toUTC().toJSDate(),
        ends_at: endLondon.toUTC().toJSDate(),
        cancel_token,
      },
      select: {
        booking_id: true,
        cancel_token: true,
        starts_at: true,
        ends_at: true,
      },
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

const CancelInput = z.object({
  cancel_token: z.string().min(10),
});

app.post('/api/bookings/:id/cancel', async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    if (!Number.isInteger(bookingId)) return res.status(400).json({ error: 'Invalid booking id' });

    const parsed = CancelInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid cancel token' });

    const booking = await prisma.booking.findUnique({ where: { booking_id: bookingId } });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.cancel_token !== parsed.data.cancel_token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (booking.status === 'cancelled') {
      return res.status(200).json({ ok: true, message: 'Already cancelled' });
    }

    await prisma.booking.update({
      where: { booking_id: bookingId },
      data: { status: 'cancelled' },
    });

    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// ---- auth ----
app.post('/api/auth/login', loginGuard, async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken({ user_id: user.user_id, role: user.role, email: user.email });

  return res
    .cookie(authCookieName, token, authCookieOptions)
    .json({ email: user.email });
});

app.get('/api/auth/me', requireAdmin, (req, res) => {
  res.json({ email: req.user.email, role: req.user.role });
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName, { ...authCookieOptions, maxAge: undefined }).json({ ok: true });
});

// ---- admin bookings ----
app.get('/api/admin/bookings', requireAdmin, async (req, res) => {
  const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const to = req.query.to ? new Date(req.query.to) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const rows = await prisma.booking.findMany({
    where: { starts_at: { gte: from }, ends_at: { lte: to } },
    orderBy: { starts_at: 'asc' },
    select: {
      booking_id: true,
      status: true,
      starts_at: true,
      ends_at: true,
      client_name: true,
      client_email: true,
      client_phone: true,
      service: { select: { name: true } },
    },
  });
  res.json(rows);
});

app.post('/api/admin/bookings/:id/cancel', requireAdmin, async (req, res) => {
  const bookingId = Number(req.params.id);
  if (!Number.isInteger(bookingId)) return res.status(400).json({ error: 'Invalid id' });

  const found = await prisma.booking.findUnique({ where: { booking_id: bookingId } });
  if (!found) return res.status(404).json({ error: 'Not found' });
  if (found.status === 'cancelled') return res.json({ ok: true, message: 'Already cancelled' });

  await prisma.booking.update({ where: { booking_id: bookingId }, data: { status: 'cancelled' } });
  res.json({ ok: true });
});

// ---- admin blackouts ----
const BlackoutInput = z.object({
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
  reason: z.string().max(200).optional(),
});

app.get('/api/admin/blackouts', requireAdmin, async (req, res) => {
  const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const to = req.query.to ? new Date(req.query.to) : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

  const rows = await prisma.blackoutSlot.findMany({
    where: { starts_at: { lt: to }, ends_at: { gt: from } },
    orderBy: { starts_at: 'asc' },
  });
  res.json(rows);
});

app.post('/api/admin/blackouts', requireAdmin, async (req, res) => {
  const parsed = BlackoutInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });

  const starts = new Date(parsed.data.starts_at);
  const ends = new Date(parsed.data.ends_at);
  if (!(starts < ends)) return res.status(400).json({ error: 'ends_at must be after starts_at' });

  const MAX_DAYS = 30;
  if ((ends - starts) / (1000 * 60 * 60 * 24) > MAX_DAYS) {
    return res.status(400).json({ error: `Blackout cannot exceed ${MAX_DAYS} days` });
  }

  const created = await prisma.blackoutSlot.create({
    data: { starts_at: starts, ends_at: ends, reason: parsed.data.reason ?? null },
  });
  res.status(201).json(created);
});

app.delete('/api/admin/blackouts/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

  await prisma.blackoutSlot.delete({ where: { id } }).catch(() => {});
  res.json({ ok: true });
});

// ---- start ----
app.listen(ENV.PORT, () => {
  console.log(`[server] ${ENV.NODE_ENV} on :${ENV.PORT}`);
});