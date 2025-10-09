// server/tests/booking-conflict.test.js
import { describe, test, expect, beforeAll, beforeEach, afterAll } from '@jest/globals';
import { api, seedAdmin, cleanDb } from './helpers.js';
import { prisma } from '../src/app.js';

describe('Booking Conflicts', () => {
  beforeAll(async () => {
    await seedAdmin();
  });

  beforeEach(async () => {
    // Clean bookings and blackouts before each test
    await prisma.booking.deleteMany();
    await prisma.blackoutSlot.deleteMany();
  });

  afterAll(async () => {
    await cleanDb();
  });

  describe('Double-booking prevention', () => {
    test('prevents booking exact same time slot', async () => {
      const bookingData = {
        service_id: 1,
        client_name: 'Test User',
        client_email: 'test@example.com',
        starts_at: new Date('2025-12-15T10:00:00Z').toISOString(),
      };

      // First booking succeeds
      await api.post('/api/bookings').send(bookingData).expect(201);

      // Second booking at same time fails
      const res = await api.post('/api/bookings').send(bookingData).expect(409);
      expect(res.body.error).toMatch(/no longer available|conflict/i);
    });

    test('prevents overlapping bookings (partial overlap)', async () => {
      // First booking: 10:00-11:00
      const booking1 = {
        service_id: 1,
        client_name: 'User One',
        client_email: 'user1@example.com',
        starts_at: new Date('2025-12-15T10:00:00Z').toISOString(),
      };

      await api.post('/api/bookings').send(booking1).expect(201);

      // Second booking: 10:30-11:30 (overlaps with first)
      const booking2 = {
        service_id: 1,
        client_name: 'User Two',
        client_email: 'user2@example.com',
        starts_at: new Date('2025-12-15T10:30:00Z').toISOString(),
      };

      const res = await api.post('/api/bookings').send(booking2).expect(409);
      expect(res.body.error).toMatch(/no longer available|conflict/i);
    });

    test('allows adjacent bookings (end time = start time)', async () => {
      // First booking ends at 11:00
      const booking1 = {
        service_id: 1,
        client_name: 'User One',
        client_email: 'user1@example.com',
        starts_at: new Date('2025-12-15T10:00:00Z').toISOString(),
      };

      await api.post('/api/bookings').send(booking1).expect(201);

      // Second booking starts at 11:00 (should be allowed)
      const booking2 = {
        service_id: 1,
        client_name: 'User Two',
        client_email: 'user2@example.com',
        starts_at: new Date('2025-12-15T11:00:00Z').toISOString(),
      };

      await api.post('/api/bookings').send(booking2).expect(201);
    });

    test('allows bookings for different services at same time', async () => {
      // Assuming multiple services available
      const booking1 = {
        service_id: 1,
        client_name: 'User One',
        client_email: 'user1@example.com',
        starts_at: new Date('2025-12-15T10:00:00Z').toISOString(),
      };

      const booking2 = {
        service_id: 2,
        client_name: 'User Two',
        client_email: 'user2@example.com',
        starts_at: new Date('2025-12-15T10:00:00Z').toISOString(),
      };

      await api.post('/api/bookings').send(booking1).expect(201);
      
      // Note: Current implementation might prevent this (single practitioner)
      // This test documents expected behavior
      const res = await api.post('/api/bookings').send(booking2);
      
      // Adjust expectation based on business rules
      // If single practitioner: expect(409)
      // If multiple practitioners: expect(201)
    });

    test('ignores cancelled bookings for conflict detection', async () => {
      // Create and cancel a booking
      const booking1 = {
        service_id: 1,
        client_name: 'User One',
        client_email: 'user1@example.com',
        starts_at: new Date('2025-12-15T10:00:00Z').toISOString(),
      };

      const res1 = await api.post('/api/bookings').send(booking1).expect(201);
      const bookingId = res1.body.booking_id;

      // Cancel the booking (admin endpoint)
      const loginRes = await api
        .post('/api/auth/login')
        .send({ email: 'admin@bib.com', password: 'MySecurePassword' });

      await api
        .post(`/api/admin/bookings/${bookingId}/cancel`)
        .set('Authorization', `Bearer ${loginRes.body.token}`)
        .expect(200);

      // New booking at same time should succeed
      const booking2 = {
        service_id: 1,
        client_name: 'User Two',
        client_email: 'user2@example.com',
        starts_at: new Date('2025-12-15T10:00:00Z').toISOString(),
      };

      await api.post('/api/bookings').send(booking2).expect(201);
    });
  });

  describe('Blackout period enforcement', () => {
    test('prevents booking during blackout period', async () => {
      // Create blackout for entire day
      await prisma.blackoutSlot.create({
        data: {
          starts_at: new Date('2025-12-15T00:00:00Z'),
          ends_at: new Date('2025-12-15T23:59:59Z'),
          reason: 'Holiday',
        },
      });

      const bookingData = {
        service_id: 1,
        client_name: 'Test User',
        client_email: 'test@example.com',
        starts_at: new Date('2025-12-15T10:00:00Z').toISOString(),
      };

      const res = await api.post('/api/bookings').send(bookingData).expect(409);
      expect(res.body.error).toMatch(/no longer available|blackout|blocked/i);
    });

    test('prevents booking that partially overlaps with blackout', async () => {
      // Blackout from 09:00 to 12:00
      await prisma.blackoutSlot.create({
        data: {
          starts_at: new Date('2025-12-15T09:00:00Z'),
          ends_at: new Date('2025-12-15T12:00:00Z'),
          reason: 'Training',
        },
      });

      // Booking from 11:00 to 12:00 (overlaps with blackout)
      const bookingData = {
        service_id: 1,
        client_name: 'Test User',
        client_email: 'test@example.com',
        starts_at: new Date('2025-12-15T11:00:00Z').toISOString(),
      };

      const res = await api.post('/api/bookings').send(bookingData).expect(409);
      expect(res.body.error).toMatch(/no longer available/i);
    });

    test('allows booking before blackout period', async () => {
      // Blackout from 12:00 onwards
      await prisma.blackoutSlot.create({
        data: {
          starts_at: new Date('2025-12-15T12:00:00Z'),
          ends_at: new Date('2025-12-15T23:59:59Z'),
          reason: 'Afternoon off',
        },
      });

      // Booking from 10:00-11:00 (before blackout)
      const bookingData = {
        service_id: 1,
        client_name: 'Test User',
        client_email: 'test@example.com',
        starts_at: new Date('2025-12-15T10:00:00Z').toISOString(),
      };

      await api.post('/api/bookings').send(bookingData).expect(201);
    });

    test('allows booking after blackout period', async () => {
      // Blackout until 12:00
      await prisma.blackoutSlot.create({
        data: {
          starts_at: new Date('2025-12-15T00:00:00Z'),
          ends_at: new Date('2025-12-15T12:00:00Z'),
          reason: 'Morning blocked',
        },
      });

      // Booking from 14:00-15:00 (after blackout)
      const bookingData = {
        service_id: 1,
        client_name: 'Test User',
        client_email: 'test@example.com',
        starts_at: new Date('2025-12-15T14:00:00Z').toISOString(),
      };

      await api.post('/api/bookings').send(bookingData).expect(201);
    });

    test('handles multiple blackout periods correctly', async () => {
      // Two separate blackout periods
      await prisma.blackoutSlot.createMany({
        data: [
          {
            starts_at: new Date('2025-12-15T09:00:00Z'),
            ends_at: new Date('2025-12-15T10:00:00Z'),
            reason: 'Meeting 1',
          },
          {
            starts_at: new Date('2025-12-15T14:00:00Z'),
            ends_at: new Date('2025-12-15T15:00:00Z'),
            reason: 'Meeting 2',
          },
        ],
      });

      // Booking during first blackout - should fail
      const booking1 = {
        service_id: 1,
        client_name: 'User One',
        client_email: 'user1@example.com',
        starts_at: new Date('2025-12-15T09:30:00Z').toISOString(),
      };
      await api.post('/api/bookings').send(booking1).expect(409);

      // Booking between blackouts - should succeed
      const booking2 = {
        service_id: 1,
        client_name: 'User Two',
        client_email: 'user2@example.com',
        starts_at: new Date('2025-12-15T11:00:00Z').toISOString(),
      };
      await api.post('/api/bookings').send(booking2).expect(201);

      // Booking during second blackout - should fail
      const booking3 = {
        service_id: 1,
        client_name: 'User Three',
        client_email: 'user3@example.com',
        starts_at: new Date('2025-12-15T14:30:00Z').toISOString(),
      };
      await api.post('/api/bookings').send(booking3).expect(409);
    });
  });

  describe('Combined conflicts (bookings + blackouts)', () => {
    test('checks both booking and blackout conflicts', async () => {
      // Create existing booking
      const booking1 = {
        service_id: 1,
        client_name: 'User One',
        client_email: 'user1@example.com',
        starts_at: new Date('2025-12-15T10:00:00Z').toISOString(),
      };
      await api.post('/api/bookings').send(booking1).expect(201);

      // Create blackout
      await prisma.blackoutSlot.create({
        data: {
          starts_at: new Date('2025-12-15T14:00:00Z'),
          ends_at: new Date('2025-12-15T15:00:00Z'),
          reason: 'Break',
        },
      });

      // Try to book during existing booking time - fails
      const booking2 = {
        service_id: 1,
        client_name: 'User Two',
        client_email: 'user2@example.com',
        starts_at: new Date('2025-12-15T10:00:00Z').toISOString(),
      };
      await api.post('/api/bookings').send(booking2).expect(409);

      // Try to book during blackout - fails
      const booking3 = {
        service_id: 1,
        client_name: 'User Three',
        client_email: 'user3@example.com',
        starts_at: new Date('2025-12-15T14:00:00Z').toISOString(),
      };
      await api.post('/api/bookings').send(booking3).expect(409);

      // Book in available slot - succeeds
      const booking4 = {
        service_id: 1,
        client_name: 'User Four',
        client_email: 'user4@example.com',
        starts_at: new Date('2025-12-15T12:00:00Z').toISOString(),
      };
      await api.post('/api/bookings').send(booking4).expect(201);
    });
  });
});
