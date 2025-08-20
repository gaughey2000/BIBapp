const { DateTime, Interval } = require("luxon");

/** Return weekday 0..6 (Sun..Sat) from 'YYYY-MM-DD' in Europe/London */
function weekdayOf(dateStr) {
  return DateTime.fromISO(dateStr, { zone: "Europe/London" }).weekday % 7; // Luxon: 1=Mon..7=Sun → %7 gives 0..6 Sun..Sat
}

function toZonedDate(dateStr, timeStr, zone = "Europe/London") {
  // dateStr '2025-08-22', timeStr '10:00'
  return DateTime.fromISO(`${dateStr}T${timeStr}`, { zone });
}

/** Round up to next 15-minute tick */
function roundUp15(dt) {
  const minutes = dt.minute;
  const mod = minutes % 15;
  if (mod === 0 && dt.second === 0 && dt.millisecond === 0) return dt;
  return dt.plus({ minutes: 15 - mod }).startOf("minute");
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  // Treat as [start, end) intervals
  return aStart < bEnd && bStart < aEnd;
}

/** Generate candidate start slots between open..close in 15-min steps */
function generateCandidates(openDT, closeDT, serviceMinutes, bufferMinutes) {
  const slots = [];
  let t = roundUp15(openDT);
  const apptTotal = serviceMinutes + bufferMinutes;
  while (t.plus({ minutes: apptTotal }) <= closeDT) {
    slots.push(t);
    t = t.plus({ minutes: 15 });
  }
  return slots;
}

module.exports = {
  weekdayOf,
  toZonedDate,
  roundUp15,
  overlaps,
  generateCandidates
};