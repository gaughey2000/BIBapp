// server/src/availability.js (ESM)
import { DateTime, Duration } from 'luxon';

// 0..6 => Sun..Sat
export function weekdayOf(dateStr) {
  const d = DateTime.fromISO(dateStr, { zone: 'Europe/London' });
  if (!d.isValid) throw new Error('weekdayOf: invalid dateStr');
  return d.weekday % 7;
}

// Build a Europe/London DateTime for specific date + time ("HH:mm" or "HH:mm:ss")
export function toZonedDate(dateStr, timeStr) {
  const hasSecs = (timeStr ?? '').split(':').length === 3;
  const iso = `${dateStr}T${timeStr}${hasSecs ? '' : ':00'}`;
  const dt = DateTime.fromISO(iso, { zone: 'Europe/London' });
  if (!dt.isValid) throw new Error('toZonedDate: invalid inputs');
  return dt;
}

// [start, end) overlap check
export function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// Generate 15-min candidate starts within [openDT, closeDT)
export function generateCandidates(openDT, closeDT, serviceMinutes, bufferMinutes = 0) {
  if (!(openDT?.isValid && closeDT?.isValid)) {
    throw new Error('generateCandidates: invalid open/close');
  }
  const step = Duration.fromObject({ minutes: 15 });
  const total = Duration.fromObject({ minutes: Number(serviceMinutes) + Number(bufferMinutes) });
  const out = [];
  for (let t = openDT; t < closeDT; t = t.plus(step)) {
    const end = t.plus(total);
    if (end <= closeDT) out.push(t);
  }
  return out;
}