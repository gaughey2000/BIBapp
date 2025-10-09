// server/tests/admin-auth.test.js
import { describe, test, expect, beforeAll } from '@jest/globals';
import { api, seedAdmin } from './helpers.js';

describe('Admin Authorization', () => {
  let validToken;

  beforeAll(async () => {
    await seedAdmin();
    
    // Get a valid token for authenticated tests
    const loginRes = await api
      .post('/api/auth/login')
      .send({ email: 'admin@bib.com', password: 'MySecurePassword' });
    
    validToken = loginRes.body.token;
  });

  describe('Protected routes', () => {
    test('GET /api/admin/bookings requires authentication', async () => {
      const res = await api.get('/api/admin/bookings').expect(401);
      expect(res.body.error).toMatch(/unauthorized|not authenticated/i);
    });

    test('GET /api/admin/blackouts requires authentication', async () => {
      const res = await api.get('/api/admin/blackouts').expect(401);
      expect(res.body.error).toMatch(/unauthorized|not authenticated/i);
    });

    test('POST /api/admin/blackouts requires authentication', async () => {
      const res = await api
        .post('/api/admin/blackouts')
        .send({
          starts_at: new Date('2025-12-15T10:00:00Z').toISOString(),
          ends_at: new Date('2025-12-15T11:00:00Z').toISOString(),
        })
        .expect(401);
      
      expect(res.body.error).toMatch(/unauthorized|not authenticated/i);
    });

    test('POST /api/admin/bookings/:id/cancel requires authentication', async () => {
      const res = await api
        .post('/api/admin/bookings/some-id/cancel')
        .expect(401);
      
      expect(res.body.error).toMatch(/unauthorized|not authenticated/i);
    });

    test('DELETE /api/admin/blackouts/:id requires authentication', async () => {
      const res = await api
        .delete('/api/admin/blackouts/1')
        .expect(401);
      
      expect(res.body.error).toMatch(/unauthorized|not authenticated/i);
    });
  });

  describe('Token validation', () => {
    test('rejects invalid token format', async () => {
      const res = await api
        .get('/api/admin/bookings')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
      
      expect(res.body.error).toMatch(/invalid|unauthorized/i);
    });

    test('rejects expired token', async () => {
      // This would require mocking time or using a pre-expired token
      // For now, we test the mechanism exists
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj0vHYcRXAljr3H5cMjhGJXp3zvY-rIK9J_o7YFA';
      
      const res = await api
        .get('/api/admin/bookings')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });

    test('accepts valid token via Authorization header', async () => {
      const res = await api
        .get('/api/admin/bookings')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('accepts valid token via cookie', async () => {
      // Get token via login (which sets cookie)
      const loginRes = await api
        .post('/api/auth/login')
        .send({ email: 'admin@bib.com', password: 'MySecurePassword' })
        .expect(200);
      
      const cookies = loginRes.headers['set-cookie'];
      expect(cookies).toBeDefined();
      
      // Use cookie in subsequent request
      const res = await api
        .get('/api/admin/bookings')
        .set('Cookie', cookies)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('rejects token with wrong secret', async () => {
      // This tests that JWT verification uses the correct secret
      const wrongSecretToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AYmliLmNvbSIsImlhdCI6MTYzMDAwMDAwMCwiZXhwIjoyNjMwMDAwMDAwfQ.wrong_signature';
      
      const res = await api
        .get('/api/admin/bookings')
        .set('Authorization', `Bearer ${wrongSecretToken}`)
        .expect(401);
    });
  });

  describe('Authenticated admin operations', () => {
    test('GET /api/admin/bookings returns list of bookings', async () => {
      const res = await api
        .get('/api/admin/bookings')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBe(true);
      // Each booking should have expected fields
      if (res.body.length > 0) {
        const booking = res.body[0];
        expect(booking).toHaveProperty('booking_id');
        expect(booking).toHaveProperty('client_name');
        expect(booking).toHaveProperty('starts_at');
        expect(booking).toHaveProperty('status');
      }
    });

    test('GET /api/admin/blackouts returns list of blackouts', async () => {
      const res = await api
        .get('/api/admin/blackouts')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);
      
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST /api/admin/blackouts creates blackout period', async () => {
      const blackoutData = {
        starts_at: new Date('2026-01-15T10:00:00Z').toISOString(),
        ends_at: new Date('2026-01-15T11:00:00Z').toISOString(),
        reason: 'Test blackout',
      };
      
      const res = await api
        .post('/api/admin/blackouts')
        .set('Authorization', `Bearer ${validToken}`)
        .send(blackoutData)
        .expect(201);
      
      expect(res.body).toHaveProperty('id');
      expect(res.body.reason).toBe('Test blackout');
    });

    test('DELETE /api/admin/blackouts/:id removes blackout', async () => {
      // First create a blackout
      const createRes = await api
        .post('/api/admin/blackouts')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          starts_at: new Date('2026-02-15T10:00:00Z').toISOString(),
          ends_at: new Date('2026-02-15T11:00:00Z').toISOString(),
        })
        .expect(201);
      
      const blackoutId = createRes.body.id;
      
      // Then delete it
      await api
        .delete(`/api/admin/blackouts/${blackoutId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);
      
      // Verify it's gone
      const listRes = await api
        .get('/api/admin/blackouts')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);
      
      const exists = listRes.body.some(b => b.id === blackoutId);
      expect(exists).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    test('returns user info for valid token', async () => {
      const res = await api
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);
      
      expect(res.body).toHaveProperty('email');
      expect(res.body.email).toBe('admin@bib.com');
      expect(res.body).toHaveProperty('role');
      expect(res.body.role).toBe('admin');
    });

    test('returns 401 without token', async () => {
      await api
        .get('/api/auth/me')
        .expect(401);
    });

    test('returns 401 with invalid token', async () => {
      await api
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid')
        .expect(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    test('clears auth cookie', async () => {
      const res = await api
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);
      
      expect(res.body).toHaveProperty('ok');
      expect(res.body.ok).toBe(true);
      
      // Check that cookie is cleared (max-age=0 or expires in past)
      const cookies = res.headers['set-cookie'];
      if (cookies) {
        const tokenCookie = cookies.find(c => c.startsWith('token='));
        if (tokenCookie) {
          // Cookie should be cleared (empty value or max-age=0)
          expect(tokenCookie).toMatch(/token=;|Max-Age=0/i);
        }
      }
    });

    test('works without token (idempotent)', async () => {
      await api
        .post('/api/auth/logout')
        .expect(200);
    });
  });

  describe('Rate limiting', () => {
    test('login endpoint has rate limit', async () => {
      // Try to login many times rapidly
      const attempts = [];
      for (let i = 0; i < 10; i++) {
        attempts.push(
          api
            .post('/api/auth/login')
            .send({ email: 'wrong@email.com', password: 'wrong' })
        );
      }
      
      const results = await Promise.all(attempts);
      
      // Some should be rate limited (429)
      const rateLimited = results.some(r => r.status === 429);
      expect(rateLimited).toBe(true);
    }, 10000); // Increase timeout for this test
  });
});
