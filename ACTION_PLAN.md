# 🎯 Code Review Action Plan - BIB Application

**Generated:** October 8, 2025  
**Priority Order:** Critical → High → Medium → Low  
**Estimated Total Time:** 28-36 hours

---

## 🔴 Critical Priority (Complete in 1-2 Days)

### 1. Fix JWT_SECRET Security Issue
**File:** `server/src/config/env.js`  
**Time:** 30 minutes  
**Impact:** Security vulnerability in production

**Current Code:**
```javascript
JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
```

**Fixed Code:**
```javascript
const isProd = process.env.NODE_ENV === 'production';

JWT_SECRET: isProd 
  ? required('JWT_SECRET') 
  : (process.env.JWT_SECRET || "dev-secret"),
```

**Testing:**
```bash
# Should fail in production without JWT_SECRET
NODE_ENV=production npm start
# Expected: Error: [ENV] Missing required env: JWT_SECRET
```

---

### 2. Add Database Connection Error Handling
**File:** `server/src/app.js`  
**Time:** 45 minutes  
**Impact:** Application crashes without graceful error

**Current Code:**
```javascript
export const prisma = new PrismaClient();
```

**Fixed Code:**
```javascript
export const prisma = new PrismaClient({
  log: ENV.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// Add connection test
prisma.$connect()
  .then(() => console.log('✅ Database connected'))
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
```

**Testing:**
```bash
# Test with invalid DATABASE_URL
DATABASE_URL="postgresql://invalid" npm start
# Expected: Graceful error and exit
```

---

### 3. Add Request Logging Middleware
**File:** `server/src/app.js`  
**Time:** 1 hour  
**Impact:** Cannot debug production issues

**Install:**
```bash
cd server
npm install morgan
```

**Add to app.js (after line 28):**
```javascript
import morgan from 'morgan';

// Add after helmet()
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));
}
```

**Testing:**
```bash
npm run dev
# Make a request
curl http://localhost:3001/api/services
# Should see: GET /api/services 200 - 45ms
```

---

## 🔴 High Priority (Complete in 1 Week)

### 4. Add Database Indices for Performance
**File:** `server/prisma/schema.prisma`  
**Time:** 2 hours (including migration testing)  
**Impact:** Slow queries as data grows

**Add to schema.prisma:**
```prisma
model Booking {
  // ... existing fields
  
  @@index([starts_at, ends_at])
  @@index([status])
  @@index([client_email])
  @@index([created_at])
}

model Service {
  // ... existing fields
  
  @@index([is_active])
  @@index([treatment_type, name])  // Already exists, verify
}

model BlackoutSlot {
  // ... existing fields
  
  @@index([starts_at, ends_at])
}
```

**Migration:**
```bash
cd server
npx prisma migrate dev --name add_performance_indices
```

**Testing:**
```sql
-- Check indices were created
\d+ "Booking"
\d+ "Service"
\d+ "BlackoutSlot"
```

---

### 5. Create Constants File for Magic Values
**File:** `server/src/constants.js` (new)  
**Time:** 1 hour  
**Impact:** Maintainability and consistency

**Create new file:**
```javascript
// server/src/constants.js

export const BookingStatus = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
};

export const BookingConfig = {
  MIN_ADVANCE_MINUTES: 60,
  MAX_BLACKOUT_DAYS: 30,
  SLOT_INTERVAL_MINUTES: 15,
};

export const TokenConfig = {
  JWT_EXPIRES_IN: '2h',
  COOKIE_MAX_AGE: 2 * 60 * 60, // 2 hours in seconds
};

export const RateLimits = {
  LOGIN_WINDOW_MS: 60 * 1000,
  LOGIN_MAX_ATTEMPTS: 5,
  BOOKING_WINDOW_MS: 60 * 1000,
  BOOKING_MAX_REQUESTS: 30,
};
```

**Update app.js:**
```javascript
import { BookingStatus, BookingConfig } from './constants.js';

// Replace line 39:
const BOOKING_MIN_ADVANCE_MIN = BookingConfig.MIN_ADVANCE_MINUTES;

// Replace line 76:
where: { status: BookingStatus.CONFIRMED }

// Replace line 357:
const MAX_DAYS = BookingConfig.MAX_BLACKOUT_DAYS;
```

**Update middleware/rateLimiters.js:**
```javascript
import { RateLimits } from '../constants.js';

export const loginLimiter = rateLimit({
  windowMs: RateLimits.LOGIN_WINDOW_MS,
  max: RateLimits.LOGIN_MAX_ATTEMPTS,
  // ...
});
```

---

### 6. Standardize Error Response Format
**File:** `server/src/middleware/errorHandler.js` (new)  
**Time:** 2 hours  
**Impact:** Consistent API responses

**Create new file:**
```javascript
// server/src/middleware/errorHandler.js

export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

export function errorHandler(err, req, res, next) {
  // Log error
  console.error({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    error: err.message,
    stack: err.stack,
  });

  // Send standardized response
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
      timestamp: err.timestamp,
      path: req.url,
    });
  }

  // Generic 500 error
  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString(),
    path: req.url,
  });
}
```

**Update app.js:**
```javascript
import { errorHandler, ApiError } from './middleware/errorHandler.js';

// Replace generic error handler (line 375) with:
app.use(errorHandler);

// Update endpoint errors (example):
if (!service || !service.is_active) {
  throw new ApiError(404, 'Service not found');
}
```

---

### 7. Improve Test Coverage - Backend
**Files:** `server/tests/*.test.js`  
**Time:** 8 hours  
**Impact:** Catch bugs before production

**Create new test files:**

**a) `server/tests/availability.test.js`:**
```javascript
import { weekdayOf, toZonedDate, overlaps, generateCandidates } from '../src/availability.js';
import { DateTime } from 'luxon';

describe('Availability functions', () => {
  test('weekdayOf returns correct weekday', () => {
    expect(weekdayOf('2025-01-06')).toBe(1); // Monday
    expect(weekdayOf('2025-01-12')).toBe(0); // Sunday
  });

  test('toZonedDate creates London timezone DateTime', () => {
    const dt = toZonedDate('2025-01-15', '10:00');
    expect(dt.zoneName).toBe('Europe/London');
    expect(dt.hour).toBe(10);
  });

  test('overlaps detects time conflicts', () => {
    const a1 = DateTime.fromISO('2025-01-15T10:00');
    const a2 = DateTime.fromISO('2025-01-15T11:00');
    const b1 = DateTime.fromISO('2025-01-15T10:30');
    const b2 = DateTime.fromISO('2025-01-15T11:30');
    
    expect(overlaps(a1, a2, b1, b2)).toBe(true);
  });

  test('generateCandidates creates 15-min slots', () => {
    const open = DateTime.fromISO('2025-01-15T09:00', { zone: 'Europe/London' });
    const close = DateTime.fromISO('2025-01-15T10:00', { zone: 'Europe/London' });
    const slots = generateCandidates(open, close, 30, 15);
    
    expect(slots.length).toBe(2); // 09:00, 09:15 (09:30 would end at 10:15)
  });
});
```

**b) `server/tests/booking-conflict.test.js`:**
```javascript
import { api, seedAdmin, cleanDb } from './helpers.js';
import { prisma } from '../src/app.js';

describe('Booking conflicts', () => {
  beforeEach(async () => {
    await cleanDb();
    await seedAdmin();
  });

  test('prevents double-booking same time slot', async () => {
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
    expect(res.body.error).toContain('no longer available');
  });

  test('prevents booking during blackout period', async () => {
    // Create blackout
    await prisma.blackoutSlot.create({
      data: {
        starts_at: new Date('2025-12-15T09:00:00Z'),
        ends_at: new Date('2025-12-15T17:00:00Z'),
      },
    });

    const bookingData = {
      service_id: 1,
      client_name: 'Test User',
      client_email: 'test@example.com',
      starts_at: new Date('2025-12-15T10:00:00Z').toISOString(),
    };

    const res = await api.post('/api/bookings').send(bookingData).expect(409);
    expect(res.body.error).toContain('no longer available');
  });
});
```

**c) `server/tests/admin-auth.test.js`:**
```javascript
import { api, seedAdmin } from './helpers.js';

describe('Admin authorization', () => {
  test('GET /api/admin/bookings requires auth', async () => {
    await api.get('/api/admin/bookings').expect(401);
  });

  test('GET /api/admin/bookings works with valid token', async () => {
    await seedAdmin();
    const loginRes = await api
      .post('/api/auth/login')
      .send({ email: 'admin@bib.com', password: 'MySecurePassword' });

    const token = loginRes.body.token;
    const res = await api
      .get('/api/admin/bookings')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
```

**Run tests:**
```bash
cd server
npm test
```

---

### 8. Improve Test Coverage - Frontend
**Files:** `client/src/__tests__/*.test.jsx`  
**Time:** 6 hours  
**Impact:** Catch UI bugs early

**Create new test files:**

**a) `client/src/__tests__/UserBookingPage.test.jsx`:**
```jsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserBookingPage from '../pages/UserBookingPage';
import * as api from '../api';

// Mock API
vi.mock('../api');

describe('UserBookingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('shows policy popup on first visit', () => {
    render(
      <BrowserRouter>
        <UserBookingPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Privacy Notice/i)).toBeInTheDocument();
  });

  test('loads and displays services', async () => {
    api.fetchServices.mockResolvedValue([
      { service_id: 1, name: 'Test Service', price_cents: 5000 }
    ]);

    render(
      <BrowserRouter>
        <UserBookingPage />
      </BrowserRouter>
    );

    // Accept policy first
    fireEvent.click(screen.getByText(/I accept/i));

    await waitFor(() => {
      expect(screen.getByText('Test Service')).toBeInTheDocument();
    });
  });

  test('advances to date selection after service chosen', async () => {
    api.fetchServices.mockResolvedValue([
      { service_id: 1, name: 'Test Service', price_cents: 5000 }
    ]);

    render(
      <BrowserRouter>
        <UserBookingPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/I accept/i));

    await waitFor(() => {
      const serviceButton = screen.getByText('Test Service');
      fireEvent.click(serviceButton);
    });

    // Should show step 2
    expect(screen.getByText(/Choose date/i)).toBeInTheDocument();
  });
});
```

**b) `client/src/__tests__/api.test.js`:**
```javascript
import { fetchAvailability, createBooking } from '../api';

global.fetch = vi.fn();

describe('API client', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('fetchAvailability validates inputs', async () => {
    await expect(
      fetchAvailability('invalid', '2025-01-15')
    ).rejects.toThrow(/Invalid serviceId/);

    await expect(
      fetchAvailability(1, 'invalid-date')
    ).rejects.toThrow(/Invalid date/);
  });

  test('createBooking sends correct payload', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ booking_id: '123' }),
    });

    const result = await createBooking({
      service_id: 1,
      client_name: 'Test',
      client_email: 'test@example.com',
      starts_at: '2025-01-15T10:00:00Z',
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/bookings'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );

    expect(result).toEqual({ booking_id: '123' });
  });
});
```

**Run tests:**
```bash
cd client
npm test
```

---

## 🟡 Medium Priority (Complete in 2-3 Weeks)

### 9. Add API Documentation with Swagger
**Time:** 4 hours  
**Impact:** Developer experience

**Install:**
```bash
cd server
npm install swagger-jsdoc swagger-ui-express
```

**Create:** `server/src/swagger.js`
```javascript
import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BIB Beauty Booking API',
      version: '1.0.0',
      description: 'REST API for beauty treatment bookings',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/app.js', './src/routes/*.js'],
};

export const swaggerSpec = swaggerJsDoc(options);
```

**Add to app.js:**
```javascript
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';

// After routes, before error handler
if (ENV.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
```

**Add JSDoc comments to endpoints:**
```javascript
/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: List all active services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of active services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   service_id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price_cents:
 *                     type: integer
 */
app.get("/api/services", async (_req, res) => {
  // ...
});
```

**Test:**
Visit http://localhost:3001/api-docs

---

### 10. Refactor AdminDashboard Component
**File:** `client/src/pages/AdminDashboard.jsx`  
**Time:** 4 hours  
**Impact:** Maintainability

**Split into separate components:**

**Create:** `client/src/components/admin/BookingsTable.jsx`
```jsx
import { useState } from 'react';

export default function BookingsTable({ bookings, onCancel }) {
  const [cancelling, setCancelling] = useState(null);

  async function handleCancel(id) {
    setCancelling(id);
    try {
      await onCancel(id);
    } finally {
      setCancelling(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.booking_id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(booking.starts_at).toLocaleString('en-GB')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {booking.client_name}
                </div>
                <div className="text-sm text-gray-500">
                  {booking.client_email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {booking.service.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancel(booking.booking_id)}
                    disabled={cancelling === booking.booking_id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {cancelling === booking.booking_id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Create:** `client/src/components/admin/BlackoutManager.jsx`
```jsx
import { useState } from 'react';

export default function BlackoutManager({ 
  blackouts, 
  onCreate, 
  onDelete,
  loading 
}) {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('17:00');
  const [reason, setReason] = useState('');
  const [wholeDay, setWholeDay] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    
    try {
      await onCreate({
        startDate,
        startTime: wholeDay ? '00:00' : startTime,
        endDate: wholeDay ? startDate : endDate,
        endTime: wholeDay ? '23:59' : endTime,
        reason,
      });
      
      // Reset form
      setStartDate('');
      setEndDate('');
      setReason('');
      setWholeDay(false);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-medium">Create Blackout Period</h3>
        
        {error && (
          <div className="bg-red-50 text-red-800 p-3 rounded">
            {error}
          </div>
        )}

        {/* Form fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          
          {!wholeDay && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </>
          )}
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={wholeDay}
              onChange={(e) => setWholeDay(e.target.checked)}
              className="rounded border-gray-300 text-rose-600"
            />
            <span className="ml-2 text-sm text-gray-700">Full day blackout</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason (optional)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Holiday, Training"
            className="w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Creating...' : 'Create Blackout'}
        </button>
      </form>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Active Blackouts</h3>
        
        {blackouts.length === 0 ? (
          <p className="text-gray-500 text-sm">No blackout periods</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {blackouts.map((blackout) => (
              <li key={blackout.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {new Date(blackout.starts_at).toLocaleString('en-GB')}
                    {' → '}
                    {new Date(blackout.ends_at).toLocaleString('en-GB')}
                  </div>
                  {blackout.reason && (
                    <div className="text-sm text-gray-500">{blackout.reason}</div>
                  )}
                </div>
                <button
                  onClick={() => onDelete(blackout.id)}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
```

**Update AdminDashboard.jsx** to use new components:
```jsx
import BookingsTable from '../components/admin/BookingsTable';
import BlackoutManager from '../components/admin/BlackoutManager';

// In component:
return (
  <div className="container mx-auto px-4 py-8">
    <BookingsTable 
      bookings={rows} 
      onCancel={handleCancelBooking} 
    />
    
    <BlackoutManager
      blackouts={bos}
      onCreate={createBlackout}
      onDelete={deleteBlackout}
      loading={bLoading}
    />
    
    {/* FullCalendar section */}
  </div>
);
```

---

### 11. Add PropTypes for Type Safety
**Time:** 3 hours  
**Impact:** Catch prop errors early

**Install:**
```bash
cd client
npm install prop-types
```

**Add to components (example - ServiceSelector):**
```jsx
import PropTypes from 'prop-types';

function ServiceSelector({ services, selected, onChange }) {
  // ... component code
}

ServiceSelector.propTypes = {
  services: PropTypes.arrayOf(PropTypes.shape({
    service_id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price_cents: PropTypes.number.isRequired,
    treatment_type: PropTypes.string,
  })).isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
};

export default ServiceSelector;
```

---

### 12. Add Error Monitoring with Sentry
**Time:** 2 hours  
**Impact:** Production error tracking

**Install:**
```bash
cd client
npm install @sentry/react

cd ../server
npm install @sentry/node
```

**Frontend setup:**
```jsx
// client/src/main.jsx
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
  });
}
```

**Backend setup:**
```javascript
// server/src/app.js
import * as Sentry from '@sentry/node';

if (ENV.NODE_ENV === 'production' && ENV.SENTRY_DSN) {
  Sentry.init({
    dsn: ENV.SENTRY_DSN,
    environment: ENV.NODE_ENV,
    tracesSampleRate: 0.1,
  });
  
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// Before error handler:
if (ENV.NODE_ENV === 'production' && ENV.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}
```

---

## 🟢 Low Priority (Nice to Have - Future)

### 13. Add Service Worker for Offline Support
**Time:** 4 hours  
**Files:** `client/src/sw.js`, `client/vite.config.js`

**Install PWA plugin:**
```bash
cd client
npm install vite-plugin-pwa -D
```

**Update vite.config.js:**
```javascript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.bibclinic\.com\/api\/services$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'services-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
            },
          },
        ],
      },
      manifest: {
        name: 'BIB Beauty Booking',
        short_name: 'BIB',
        description: 'Book beauty treatments online',
        theme_color: '#E9967A',
        icons: [
          {
            src: '/logo-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logo-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
```

---

### 14. Image Optimization
**Time:** 2 hours

**Convert images to WebP:**
```bash
# Install sharp for image conversion
npm install -g sharp-cli

# Convert images
sharp -i public/logo-full-rose.png -o public/logo-full-rose.webp
```

**Use with fallback:**
```jsx
<picture>
  <source srcSet="/logo-full-rose.webp" type="image/webp" />
  <img src="/logo-full-rose.png" alt="BIB Logo" />
</picture>
```

---

### 15. Add Analytics
**Time:** 1 hour

**Google Analytics 4:**
```jsx
// client/src/main.jsx
import ReactGA from 'react-ga4';

if (import.meta.env.VITE_GA_ID) {
  ReactGA.initialize(import.meta.env.VITE_GA_ID);
}

// Track page views
function App() {
  const location = useLocation();
  
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);
  
  return <Routes>...</Routes>;
}
```

---

## 📋 Implementation Checklist

### Week 1: Critical & High Priority
- [ ] Fix JWT_SECRET security issue
- [ ] Add database connection error handling
- [ ] Add request logging middleware
- [ ] Add database indices
- [ ] Create constants file
- [ ] Standardize error responses

### Week 2: Testing
- [ ] Add backend availability tests
- [ ] Add backend booking conflict tests
- [ ] Add backend admin auth tests
- [ ] Add frontend UserBookingPage tests
- [ ] Add frontend API client tests
- [ ] Verify 60%+ test coverage

### Week 3: Documentation & Refactoring
- [ ] Add Swagger API documentation
- [ ] Refactor AdminDashboard component
- [ ] Add PropTypes to all components
- [ ] Add error monitoring (Sentry)

### Future: Enhancements
- [ ] Implement service worker
- [ ] Optimize images
- [ ] Add analytics
- [ ] Consider TypeScript migration

---

## 🎓 Testing Commands

After implementing fixes, run these commands:

```bash
# Backend tests
cd server
npm test
npm run lint  # if you add ESLint

# Frontend tests
cd client
npm test
npm run lint
npm run build  # Verify build works

# Full stack test
cd ..
npm test  # Runs both

# Manual testing checklist
1. Start both servers
2. Test booking flow end-to-end
3. Test admin login and dashboard
4. Test error scenarios (bad network, invalid input)
5. Test on mobile device
6. Test in different browsers (Chrome, Safari, Firefox)
```

---

## 📊 Success Metrics

After completing this action plan, you should see:

- ✅ 0 critical security issues
- ✅ 60%+ test coverage
- ✅ <2s page load time
- ✅ API documentation available
- ✅ Error monitoring active
- ✅ Standardized error responses
- ✅ Improved maintainability score

---

**Next Review Date:** 30 days after completion  
**Contact:** Generate new review after implementing fixes
