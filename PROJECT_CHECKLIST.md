# ✅ BIB Project Completion Checklist

## Phase 1 – Security Foundation (≈3 hrs)
- [ x ] Enforce required env vars (`CLIENT_URL`, `JWT_SECRET`) – no fallbacks
- [ x ] Secure cookies in prod (`httpOnly`, `secure`, `sameSite`)
- [ x ] Strict CORS (only allow `CLIENT_URL` + localhost for dev)
- [ x ] Add login rate limiter (`/api/auth/login`, max 5/min)

X **Checkpoint:** Starting server with missing env should throw an error. X

---

## Phase 2 – Frontend Auth Persistence (≈1.5 hrs)
- [ x ] In `AuthProvider`, call `/api/auth/me` on mount
- [ x ] Set `authed=true` if 200, `false` otherwise
- [ x ] Update `ProtectedRoute` to wait for auth state before rendering

X **Checkpoint:** Log in → refresh page → still in Admin Dashboard. X

---

## Phase 3 – Tests Scaffold (≈5 hrs)

### Back end (Jest + Supertest)
- [ x ] Test `GET /health` → 200
- [ x ] Test `POST /api/auth/login` (seeded admin) → 200 + cookie
- [ x ] Test `GET /api/services` → returns array
- [ x ] Test `POST /api/bookings` with invalid payload → 400

### Front end (Vitest + RTL)
- [ x ] Test HomePage renders mock services
- [ x ] Test Admin login form shows error on bad creds

X **Checkpoint:** `npm test` runs both FE + BE and all tests pass. X

---

## Phase 4 – Deployment to Render (≈3–4 hrs)

### Back end
- [ ] Add `npm run prisma:deploy` → `prisma migrate deploy`
- [ ] Ensure `npm start` launches server
- [ ] Set envs on Render (`DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`)

### Front end
- [ ] Use `VITE_API_URL` for API base URL
- [ ] Confirm `npm run build` works
- [ ] Set `VITE_API_URL` on Render to server URL

### Deployment
- [ ] Create Postgres DB on Render
- [ ] Deploy server service → connect to DB
- [ ] Deploy client service → point to server
- [ ] Run migrations in prod

**Checkpoint:** Visit FE Render URL → book service → booking appears in DB.

---

## Phase 5 – Final Polish (≈1 hr)
- [ ] Add `.env.example` files (FE + BE)
- [ ] Update README with run, test, deploy instructions
- [ ] Add UX touches (loading spinners, error banners)

**Checkpoint:** Fresh clone → can run project locally with only `.env` filled.

---

# 🔑 Order of Work
1. Phase 1: Security
2. Phase 2: FE Auth Persistence
3. Phase 3: Tests
4. Phase 4: Render Deployment
5. Phase 5: Final Polish