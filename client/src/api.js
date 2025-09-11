// client/src/api.js
// Base URL from env; no trailing slash
const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

// ---- internal helpers ----
async function handle(res) {
  if (!res.ok) {
    // try to surface server error body
    let detail = "";
    try { detail = await res.text(); } catch {}
    const msg = `${res.status} ${res.statusText}${detail ? `: ${detail}` : ""}`;
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
}

function get(path, opts = {}) {
  return fetch(`${BASE}${path}`, {
    method: "GET",
    credentials: "include", // send/receive cookies (SameSite=None on server)
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  }).then(handle);
}

function post(path, body, opts = {}) {
  return fetch(`${BASE}${path}`, {
    method: opts.method || "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...opts,
  }).then(handle);
}

// ---- main API ----
export const api = {
  // Auth
  me: () => get("/api/auth/me"),
  login: (email, password) => post("/api/auth/login", { email, password }),
  logout: () => post("/api/auth/logout", {}),

  // Services
  services: () => get("/api/services"),
  service: (id) => get(`/api/services/${id}`),

  // Availability
  availability: (serviceId, date) =>
    get(`/api/availability?serviceId=${serviceId}&date=${encodeURIComponent(date)}`),

  // Bookings (public)
  book: (payload) => post("/api/bookings", payload),

  // Admin
  admin: {
    bookings: (from, to) =>
      get(`/api/admin/bookings?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`),
    cancel: (id) => post(`/api/admin/bookings/${id}/cancel`, {}),

    blackouts: () => get("/api/admin/blackouts"),
    createBlackout: (payload) => post("/api/admin/blackouts", payload),
    deleteBlackout: (id) => post(`/api/admin/blackouts/${id}`, {}, { method: "DELETE" }),
  },
};

// ---- compatibility named exports (old code paths) ----
// Auth
export const whoAmI = () => api.me();
export const getMe = () => api.me();
export const adminLogin = (email, password) => api.login(email, password);
export const adminLogout = () => api.logout();

// Services
export const fetchServices = () => api.services();
export const fetchService = (id) => api.service(id);

// Availability
export const getAvailability = (serviceId, date) => api.availability(serviceId, date);

// Bookings (public)
export const createBooking = (payload) => api.book(payload);

// Admin
export const getAdminBookings = (from, to) => api.admin.bookings(from, to);
export const cancelBookingAdmin = (id) => api.admin.cancel(id);
export const getBlackouts = () => api.admin.blackouts();
export const createBlackout = (payload) => api.admin.createBlackout(payload);
export const deleteBlackout = (id) => api.admin.deleteBlackout(id);

// (optional) export BASE for debugging
export { BASE as __API_BASE__ };