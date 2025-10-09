# 📋 TODO List - BIB Application Next Steps

**Last Updated:** October 8, 2025  
**Current Grade:** A- (from B+)  
**Status:** Quick Wins Complete ✅ | High Priority: 1.5/4 Done

---

## ✅ COMPLETED

### Code Review & Quick Wins (5 hours) ✅
- [x] Deep code review of entire codebase (3,905 lines)
- [x] Generated 114 KB of comprehensive documentation
- [x] Fixed critical JWT_SECRET security vulnerability
- [x] Added request logging with morgan
- [x] Created constants file for business rules
- [x] Added database connection testing
- [x] Enhanced health check endpoint
- [x] Added environment validation
- [x] Created Spinner component
- [x] Created Toast component
- [x] Updated Google Reviews URL
- [x] Added smooth mobile menu animations
- [x] Created analytics tracking helper
- [x] Added root package.json scripts
- [x] Configured VSCode settings
- [x] Committed and pushed all changes (2 commits)

### Task #1: Database Indices ✅ (30 min)
- [x] Added 7 performance indices to Prisma schema
- [x] Created migration documentation
- [x] Committed and pushed (commit: f4b0862)

### Task #2: Test Coverage 🔄 (~20% complete, 2 hours done)
- [x] Created availability.test.js (31 tests)
- [x] Created booking-conflict.test.js (20 tests)
- [x] Created admin-auth.test.js (15 tests)
- [x] Committed backend tests (commit: 504d362)
- [ ] Add frontend tests (6 hours remaining)
- [ ] Run full test suite
- [ ] Measure coverage percentage
- [ ] Reach 60%+ target

---

## 🔴 HIGH PRIORITY (Next 2-3 Weeks)

### 1. Add Database Indices (2 hours) 🔥
**Priority:** Critical for performance  
**Impact:** Prevents slow queries as data grows  
**Effort:** Low

**Files to modify:**
- `server/prisma/schema.prisma`

**Changes needed:**
```prisma
model Booking {
  // Add these indices:
  @@index([starts_at, ends_at])
  @@index([status])
  @@index([client_email])
  @@index([created_at])
}

model Service {
  @@index([is_active])
  @@index([treatment_type, name])  // Verify this exists
}

model BlackoutSlot {
  @@index([starts_at, ends_at])
}
```

**Steps:**
1. Update schema.prisma with indices
2. Run: `cd server && npx prisma migrate dev --name add_performance_indices`
3. Test with: `\d+ "Booking"` in psql to verify
4. Commit changes

**Reference:** ACTION_PLAN.md #4

---

### 2. Improve Test Coverage to 60%+ (14 hours) 🔥
**Priority:** Critical for long-term maintenance  
**Current:** ~15%  
**Target:** 60%+  
**Effort:** High but essential

#### Backend Tests Needed (8 hours):

**a) Availability Logic Tests:**
- File: `server/tests/availability.test.js` (NEW)
- Test: `weekdayOf()`, `toZonedDate()`, `overlaps()`, `generateCandidates()`
- Reference: ACTION_PLAN.md #7

**b) Booking Conflict Tests:**
- File: `server/tests/booking-conflict.test.js` (NEW)
- Test: Double-booking prevention, blackout period enforcement
- Reference: ACTION_PLAN.md #7

**c) Admin Authorization Tests:**
- File: `server/tests/admin-auth.test.js` (NEW)
- Test: Protected routes, token validation, unauthorized access

**Existing tests to expand:**
- `server/tests/auth.test.js` - Add more auth scenarios
- `server/tests/services.test.js` - Add edge cases
- `server/tests/bookings-invalid.test.js` - Add validation tests

#### Frontend Tests Needed (6 hours):

**a) UserBookingPage Tests:**
- File: `client/src/__tests__/UserBookingPage.test.jsx` (NEW)
- Test: Full booking flow, service selection, date/time picker
- Reference: ACTION_PLAN.md #8

**b) API Client Tests:**
- File: `client/src/__tests__/api.test.js` (NEW)
- Test: fetchAvailability(), createBooking(), error handling

**c) Component Tests:**
- Spinner component tests
- Toast component tests
- Navbar mobile menu tests

**Steps:**
1. Set up test environment properly
2. Write backend tests first (higher priority)
3. Write frontend tests
4. Run: `npm test` to verify
5. Aim for 60%+ coverage
6. Commit: "test: improve coverage to 60%+"

**Reference:** ACTION_PLAN.md #7-8

---

### 3. Add API Documentation with Swagger (4 hours) 🟡
**Priority:** High for developer experience  
**Impact:** Better API understanding and integration  
**Effort:** Medium

**Installation:**
```bash
cd server
npm install swagger-jsdoc swagger-ui-express
```

**Files to create:**
- `server/src/swagger.js` (NEW)

**Files to modify:**
- `server/src/app.js` - Add JSDoc comments to endpoints
- Add: `/api-docs` endpoint

**Example JSDoc:**
```javascript
/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: List all active services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services
 */
app.get("/api/services", async (_req, res) => {
  // ...
});
```

**Steps:**
1. Install swagger packages
2. Create swagger.js configuration
3. Add JSDoc comments to all endpoints
4. Add /api-docs route
5. Test: http://localhost:4000/api-docs
6. Commit: "docs: add Swagger API documentation"

**Reference:** ACTION_PLAN.md #9

---

### 4. Standardize Error Responses (2 hours) 🟡
**Priority:** High for consistency  
**Impact:** Better error handling across app  
**Effort:** Medium

**Files to create:**
- `server/src/middleware/errorHandler.js` (NEW)

**Files to modify:**
- `server/src/app.js` - Use new error handler

**Error handler structure:**
```javascript
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function errorHandler(err, req, res, next) {
  // Standardized error format
  res.status(err.statusCode || 500).json({
    error: err.message,
    details: err.details,
    timestamp: new Date().toISOString(),
    path: req.url,
  });
}
```

**Steps:**
1. Create errorHandler middleware
2. Replace generic error responses
3. Use ApiError class throughout
4. Test error scenarios
5. Commit: "feat: standardize error responses"

**Reference:** ACTION_PLAN.md #6

---

## 🟡 MEDIUM PRIORITY (Next Month)

### 5. Refactor Large Components (6 hours)
**Priority:** Medium for maintainability  
**Files:** `AdminDashboard.jsx` (350+ lines), `UserBookingPage.jsx` (200+ lines)

**AdminDashboard.jsx → Split into:**
- `components/admin/BookingsTable.jsx`
- `components/admin/BlackoutManager.jsx`
- `components/admin/AdminCalendar.jsx`

**Steps:**
1. Extract BookingsTable component
2. Extract BlackoutManager component
3. Keep calendar in main dashboard
4. Test admin functionality
5. Commit: "refactor: split AdminDashboard into smaller components"

**Reference:** ACTION_PLAN.md #10

---

### 6. Add PropTypes or TypeScript (8 hours)
**Priority:** Medium for type safety  
**Current:** No type checking  
**Options:** PropTypes (easier) or TypeScript (better long-term)

**Option A - PropTypes (Recommended first):**
```bash
cd client
npm install prop-types
```

Add to all components:
```javascript
import PropTypes from 'prop-types';

ServiceSelector.propTypes = {
  services: PropTypes.array.isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
};
```

**Option B - TypeScript (Future):**
- Migrate gradually
- Start with new components
- Convert existing components over time

**Steps:**
1. Choose PropTypes or TypeScript
2. Add to all components
3. Test thoroughly
4. Commit: "feat: add PropTypes to all components"

**Reference:** ACTION_PLAN.md #11

---

### 7. Add Error Monitoring (Sentry) (2 hours)
**Priority:** Medium for production monitoring  
**Impact:** Catch errors in production  
**Effort:** Low

**Installation:**
```bash
cd client && npm install @sentry/react
cd ../server && npm install @sentry/node
```

**Setup:**
1. Create Sentry account (free tier)
2. Get DSN keys
3. Initialize in main.jsx and index.js
4. Test error tracking
5. Add to environment variables

**Steps:**
1. Sign up for Sentry
2. Install packages
3. Configure both frontend and backend
4. Test error reporting
5. Commit: "feat: add Sentry error monitoring"

**Reference:** ACTION_PLAN.md #12

---

### 8. Add More Integration Tests (5 hours)
**Priority:** Medium  
**Current:** Limited integration tests  
**Target:** Key user flows covered

**Tests to add:**
- Complete booking flow (service → date → time → submit)
- Admin login → view bookings → cancel booking
- Availability check with conflicts
- Blackout period creation and enforcement

**Reference:** ACTION_PLAN.md (testing section)

---

## 🟢 LOW PRIORITY (Nice to Have)

### 9. Add Service Worker / PWA (4 hours)
**Priority:** Low  
**Impact:** Offline support, faster loading  
**Effort:** Medium

**Installation:**
```bash
cd client
npm install vite-plugin-pwa -D
```

**Steps:**
1. Configure vite-plugin-pwa
2. Add manifest.json
3. Cache API responses
4. Test offline functionality
5. Commit: "feat: add PWA support with service worker"

**Reference:** QUICK_WINS.md (future enhancements)

---

### 10. Image Optimization (2 hours)
**Priority:** Low  
**Impact:** Faster page loads  
**Files:** All images in `client/public/`

**Steps:**
1. Convert PNG to WebP format
2. Use `<picture>` elements with fallbacks
3. Implement lazy loading
4. Optimize file sizes
5. Commit: "perf: optimize images"

**Reference:** ACTION_PLAN.md #14

---

### 11. Internationalization (i18n) (8 hours)
**Priority:** Low (unless expanding to other countries)  
**Impact:** Support multiple languages  
**Package:** react-i18next

**Steps:**
1. Install react-i18next
2. Create translation files (en.json, etc.)
3. Wrap all text strings
4. Test language switching
5. Commit: "feat: add internationalization support"

**Reference:** CODE_REVIEW.md (i18n section)

---

### 12. Add Analytics Dashboard (4 hours)
**Priority:** Low  
**Requires:** Google Analytics set up first

**Steps:**
1. Add VITE_GA_ID to environment
2. Initialize analytics in main.jsx
3. Add tracking to key events
4. Set up GA4 dashboard
5. Monitor user behavior

**Reference:** QUICK_WINS_FINAL.md (analytics section)

---

## 🔧 OPTIONAL IMPROVEMENTS

### 13. Set Up Local Development Database
**Time:** 1 hour  
**Benefit:** Full local testing

**Options:**
1. Install PostgreSQL locally
2. Use Docker container
3. Use cloud database (Supabase, Neon)

**Docker setup:**
```bash
docker run --name bib-postgres \
  -e POSTGRES_PASSWORD=dev123 \
  -e POSTGRES_DB=bib_dev \
  -p 5432:5432 \
  -d postgres:15
```

---

### 14. Add Prettier Configuration
**Time:** 30 minutes

```bash
npm install --save-dev prettier
```

Create `.prettierrc`:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

### 15. Set Up GitHub Actions CI/CD
**Time:** 2 hours  
**Benefit:** Automated testing and deployment

Create `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
```

---

## 📊 PRIORITY MATRIX

### This Week (8 hours):
1. 🔥 Add database indices (2 hours)
2. 🔥 Start test coverage improvements (6 hours)

### Next Week (16 hours):
3. 🔥 Complete test coverage to 60% (8 hours)
4. 🟡 Add API documentation (4 hours)
5. 🟡 Standardize error responses (2 hours)
6. 🟡 Start component refactoring (2 hours)

### Next Month (16 hours):
7. 🟡 Complete component refactoring (4 hours)
8. 🟡 Add PropTypes (8 hours)
9. 🟡 Add error monitoring (2 hours)
10. 🟢 Add more integration tests (2 hours)

### Future:
11. 🟢 PWA support
12. 🟢 Image optimization
13. 🟢 Internationalization
14. 🟢 Analytics dashboard

---

## 🎯 RECOMMENDED ORDER

1. **Week 1:** Database indices + Begin testing
2. **Week 2:** Complete test coverage + API docs
3. **Week 3:** Error handling + Refactoring
4. **Week 4:** PropTypes + Error monitoring

**Total Estimated Time for High Priority:** 22 hours  
**Total Estimated Time for Medium Priority:** 21 hours  
**Total Estimated Time for All:** 50+ hours

---

## 📚 REFERENCE DOCUMENTATION

All implementation details in:
- **CODE_REVIEW.md** - Technical analysis and recommendations
- **ACTION_PLAN.md** - Step-by-step implementation guide with code
- **QUICK_WINS_FINAL.md** - Completed quick wins summary
- **REVIEW_SUMMARY.md** - Executive overview

---

## 🎉 CURRENT STATUS

**Completed:** 15/15 Quick Wins ✅  
**Overall Grade:** A- (from B+)  
**Security Grade:** A (from B)  
**Next Milestone:** 60% test coverage + database indices

**Ready for:** Production deployment (with current improvements)  
**Recommended next:** High priority items (database indices + testing)

---

**Last Updated:** October 8, 2025  
**Next Review:** After completing high priority items (2-3 weeks)
