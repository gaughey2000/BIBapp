// server/tests/availability.test.js
import { describe, test, expect } from '@jest/globals';
import { DateTime, Duration } from 'luxon';
import {
  weekdayOf,
  toZonedDate,
  overlaps,
  generateCandidates,
} from '../src/availability.js';

describe('Availability Functions', () => {
  describe('weekdayOf', () => {
    test('returns correct weekday for known dates', () => {
      expect(weekdayOf('2025-01-06')).toBe(1); // Monday
      expect(weekdayOf('2025-01-07')).toBe(2); // Tuesday
      expect(weekdayOf('2025-01-11')).toBe(6); // Saturday
      expect(weekdayOf('2025-01-12')).toBe(0); // Sunday
    });

    test('works across different months', () => {
      expect(weekdayOf('2025-02-01')).toBe(6); // Saturday
      expect(weekdayOf('2025-12-25')).toBe(4); // Thursday
    });

    test('throws error for invalid date string', () => {
      expect(() => weekdayOf('invalid-date')).toThrow();
      expect(() => weekdayOf('2025-13-01')).toThrow(); // Invalid month
    });
  });

  describe('toZonedDate', () => {
    test('creates Europe/London DateTime from date and time', () => {
      const dt = toZonedDate('2025-01-15', '10:00');
      
      expect(dt.isValid).toBe(true);
      expect(dt.zoneName).toBe('Europe/London');
      expect(dt.hour).toBe(10);
      expect(dt.minute).toBe(0);
      expect(dt.day).toBe(15);
      expect(dt.month).toBe(1);
      expect(dt.year).toBe(2025);
    });

    test('handles different time formats', () => {
      const dt1 = toZonedDate('2025-01-15', '10:00');
      const dt2 = toZonedDate('2025-01-15', '10:00:00');
      
      expect(dt1.hour).toBe(10);
      expect(dt2.hour).toBe(10);
      expect(dt1.minute).toBe(0);
      expect(dt2.minute).toBe(0);
    });

    test('handles edge times correctly', () => {
      const midnight = toZonedDate('2025-01-15', '00:00');
      const noon = toZonedDate('2025-01-15', '12:00');
      const endOfDay = toZonedDate('2025-01-15', '23:59');
      
      expect(midnight.hour).toBe(0);
      expect(noon.hour).toBe(12);
      expect(endOfDay.hour).toBe(23);
      expect(endOfDay.minute).toBe(59);
    });

    test('throws error for invalid inputs', () => {
      expect(() => toZonedDate('invalid', '10:00')).toThrow();
      expect(() => toZonedDate('2025-01-15', 'invalid')).toThrow();
    });
  });

  describe('overlaps', () => {
    test('detects overlapping time ranges', () => {
      const a1 = DateTime.fromISO('2025-01-15T10:00', { zone: 'Europe/London' });
      const a2 = DateTime.fromISO('2025-01-15T11:00', { zone: 'Europe/London' });
      const b1 = DateTime.fromISO('2025-01-15T10:30', { zone: 'Europe/London' });
      const b2 = DateTime.fromISO('2025-01-15T11:30', { zone: 'Europe/London' });
      
      expect(overlaps(a1, a2, b1, b2)).toBe(true);
    });

    test('detects when first range contains second', () => {
      const a1 = DateTime.fromISO('2025-01-15T10:00', { zone: 'Europe/London' });
      const a2 = DateTime.fromISO('2025-01-15T12:00', { zone: 'Europe/London' });
      const b1 = DateTime.fromISO('2025-01-15T10:30', { zone: 'Europe/London' });
      const b2 = DateTime.fromISO('2025-01-15T11:30', { zone: 'Europe/London' });
      
      expect(overlaps(a1, a2, b1, b2)).toBe(true);
    });

    test('detects when second range contains first', () => {
      const a1 = DateTime.fromISO('2025-01-15T10:30', { zone: 'Europe/London' });
      const a2 = DateTime.fromISO('2025-01-15T11:30', { zone: 'Europe/London' });
      const b1 = DateTime.fromISO('2025-01-15T10:00', { zone: 'Europe/London' });
      const b2 = DateTime.fromISO('2025-01-15T12:00', { zone: 'Europe/London' });
      
      expect(overlaps(a1, a2, b1, b2)).toBe(true);
    });

    test('returns false for non-overlapping ranges', () => {
      const a1 = DateTime.fromISO('2025-01-15T10:00', { zone: 'Europe/London' });
      const a2 = DateTime.fromISO('2025-01-15T11:00', { zone: 'Europe/London' });
      const b1 = DateTime.fromISO('2025-01-15T11:00', { zone: 'Europe/London' });
      const b2 = DateTime.fromISO('2025-01-15T12:00', { zone: 'Europe/London' });
      
      expect(overlaps(a1, a2, b1, b2)).toBe(false);
    });

    test('returns false for adjacent ranges (end = start)', () => {
      const a1 = DateTime.fromISO('2025-01-15T10:00', { zone: 'Europe/London' });
      const a2 = DateTime.fromISO('2025-01-15T11:00', { zone: 'Europe/London' });
      const b1 = DateTime.fromISO('2025-01-15T11:00', { zone: 'Europe/London' });
      const b2 = DateTime.fromISO('2025-01-15T12:00', { zone: 'Europe/London' });
      
      // With half-open intervals [start, end), adjacent ranges don't overlap
      expect(overlaps(a1, a2, b1, b2)).toBe(false);
    });

    test('handles same-day ranges correctly', () => {
      const a1 = DateTime.fromISO('2025-01-15T09:00', { zone: 'Europe/London' });
      const a2 = DateTime.fromISO('2025-01-15T09:30', { zone: 'Europe/London' });
      const b1 = DateTime.fromISO('2025-01-15T14:00', { zone: 'Europe/London' });
      const b2 = DateTime.fromISO('2025-01-15T15:00', { zone: 'Europe/London' });
      
      expect(overlaps(a1, a2, b1, b2)).toBe(false);
    });
  });

  describe('generateCandidates', () => {
    test('generates 15-minute interval slots', () => {
      const open = DateTime.fromISO('2025-01-15T09:00', { zone: 'Europe/London' });
      const close = DateTime.fromISO('2025-01-15T10:00', { zone: 'Europe/London' });
      
      const slots = generateCandidates(open, close, 30, 0);
      
      // From 09:00-10:00, with 30min service, possible starts: 09:00, 09:15, 09:30
      // 09:45 wouldn't work (ends at 10:15, after close)
      expect(slots.length).toBe(3);
      expect(slots[0].toISO()).toBe(open.toISO());
    });

    test('accounts for buffer time', () => {
      const open = DateTime.fromISO('2025-01-15T09:00', { zone: 'Europe/London' });
      const close = DateTime.fromISO('2025-01-15T10:00', { zone: 'Europe/London' });
      
      const slots = generateCandidates(open, close, 30, 15);
      
      // With 30min service + 15min buffer = 45min total
      // Possible starts: 09:00 (ends 09:45), 09:15 (ends 10:00)
      // 09:30 wouldn't work (ends 10:15)
      expect(slots.length).toBe(2);
    });

    test('returns empty array when no slots fit', () => {
      const open = DateTime.fromISO('2025-01-15T09:00', { zone: 'Europe/London' });
      const close = DateTime.fromISO('2025-01-15T09:15', { zone: 'Europe/London' });
      
      const slots = generateCandidates(open, close, 30, 0);
      
      // 15-minute window can't fit 30-minute service
      expect(slots.length).toBe(0);
    });

    test('handles full day of slots', () => {
      const open = DateTime.fromISO('2025-01-15T09:00', { zone: 'Europe/London' });
      const close = DateTime.fromISO('2025-01-15T17:00', { zone: 'Europe/London' });
      
      const slots = generateCandidates(open, close, 60, 0);
      
      // 8 hours = 480 minutes, 15-minute intervals = 32 slots
      // But with 60-minute service, last possible start is 16:00
      // So we get: 09:00, 09:15, 09:30, ... 16:00 = 29 slots
      expect(slots.length).toBeGreaterThan(20);
      expect(slots[0].hour).toBe(9);
      expect(slots[0].minute).toBe(0);
    });

    test('respects exact closing time', () => {
      const open = DateTime.fromISO('2025-01-15T09:00', { zone: 'Europe/London' });
      const close = DateTime.fromISO('2025-01-15T10:00', { zone: 'Europe/London' });
      
      const slots = generateCandidates(open, close, 60, 0);
      
      // Only 09:00 works (ends at 10:00 exactly)
      expect(slots.length).toBe(1);
      expect(slots[0].hour).toBe(9);
    });

    test('throws error for invalid DateTime', () => {
      expect(() => {
        generateCandidates(null, DateTime.now(), 30, 0);
      }).toThrow();
      
      expect(() => {
        generateCandidates(DateTime.now(), null, 30, 0);
      }).toThrow();
    });

    test('handles midnight boundary correctly', () => {
      const open = DateTime.fromISO('2025-01-15T23:30', { zone: 'Europe/London' });
      const close = DateTime.fromISO('2025-01-16T00:30', { zone: 'Europe/London' });
      
      const slots = generateCandidates(open, close, 30, 0);
      
      // Should handle crossing midnight
      expect(slots.length).toBeGreaterThan(0);
    });
  });
});
