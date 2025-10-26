// client/src/__tests__/api.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as api from '../api';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset token before each test
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchServices', () => {
    it('fetches services successfully', async () => {
      const mockServices = [
        { service_id: 1, name: 'Test Service', price_cents: 10000 },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockServices,
      });

      const result = await api.fetchServices();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/services'),
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      );
      expect(result).toEqual(mockServices);
    });

    it('throws error on failed request', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Server error' }),
      });

      await expect(api.fetchServices()).rejects.toThrow();
    });

    it('handles network error', async () => {
      // Mock offline
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
      });

      global.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(api.fetchServices()).rejects.toThrow(/no internet connection/i);

      // Restore
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true,
      });
    });
  });

  describe('fetchService', () => {
    it('fetches single service by ID', async () => {
      const mockService = {
        service_id: 1,
        name: 'Test Service',
        price_cents: 10000,
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockService,
      });

      const result = await api.fetchService(1);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/services/1'),
        expect.any(Object)
      );
      expect(result).toEqual(mockService);
    });

    it('throws 404 error for non-existent service', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'Service not found' }),
      });

      await expect(api.fetchService(99999)).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('logs in successfully and stores token', async () => {
      const mockResponse = {
        token: 'test-jwt-token',
        user: { email: 'test@example.com', role: 'admin' },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.login('test@example.com', 'password');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password',
          }),
        })
      );

      expect(result).toEqual(mockResponse);

      // Check token is stored
      expect(sessionStorage.getItem('bib_admin_token')).toBe('test-jwt-token');
    });

    it('throws error on invalid credentials', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ error: 'Invalid credentials' }),
      });

      await expect(
        api.login('wrong@example.com', 'wrongpass')
      ).rejects.toThrow();
    });
  });

  describe('whoAmI', () => {
    it('fetches current user with token', async () => {
      // Set token in sessionStorage
      sessionStorage.setItem('bib_admin_token', 'test-token');

      const mockUser = {
        email: 'test@example.com',
        role: 'admin',
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await api.whoAmI();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/me'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );

      expect(result).toEqual(mockUser);
    });

    it('throws 401 when not authenticated', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ error: 'Unauthorized' }),
      });

      await expect(api.whoAmI()).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('logs out and removes token', async () => {
      // Set token first
      sessionStorage.setItem('bib_admin_token', 'test-token');

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      await api.logout();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/logout'),
        expect.objectContaining({
          method: 'POST',
        })
      );

      // Token should be removed
      expect(sessionStorage.getItem('bib_admin_token')).toBeNull();
    });
  });

  describe('Admin Service Management', () => {
    beforeEach(() => {
      // Set admin token
      sessionStorage.setItem('bib_admin_token', 'admin-token');
    });

    describe('getAdminServices', () => {
      it('fetches all services including inactive', async () => {
        const mockServices = [
          { service_id: 1, name: 'Active', is_active: true },
          { service_id: 2, name: 'Inactive', is_active: false },
        ];

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockServices,
        });

        const result = await api.getAdminServices();

        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/admin/services'),
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: 'Bearer admin-token',
            }),
          })
        );

        expect(result).toEqual(mockServices);
      });
    });

    describe('createService', () => {
      it('creates new service', async () => {
        const serviceData = {
          name: 'New Service',
          price_cents: 10000,
          duration_min: 30,
        };

        const createdService = {
          service_id: 1,
          ...serviceData,
        };

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => createdService,
        });

        const result = await api.createService(serviceData);

        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/admin/services'),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(serviceData),
            headers: expect.objectContaining({
              Authorization: 'Bearer admin-token',
            }),
          })
        );

        expect(result).toEqual(createdService);
      });
    });

    describe('updateService', () => {
      it('updates existing service', async () => {
        const updates = {
          name: 'Updated Name',
          price_cents: 15000,
        };

        const updatedService = {
          service_id: 1,
          ...updates,
          duration_min: 30,
        };

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => updatedService,
        });

        const result = await api.updateService(1, updates);

        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/admin/services/1'),
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(updates),
          })
        );

        expect(result).toEqual(updatedService);
      });
    });

    describe('deleteService', () => {
      it('deletes service', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ok: true }),
        });

        const result = await api.deleteService(1);

        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/admin/services/1'),
          expect.objectContaining({
            method: 'DELETE',
          })
        );

        expect(result).toEqual({ ok: true });
      });
    });
  });

  describe('Error Handling', () => {
    it('includes error message from response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ error: 'Invalid input data' }),
      });

      await expect(api.fetchServices()).rejects.toThrow('Invalid input data');
    });

    it('falls back to statusText if no error message', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({}),
      });

      await expect(api.fetchServices()).rejects.toThrow();
    });

    it('includes status code in error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'Not found' }),
      });

      try {
        await api.fetchService(999);
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });
});
