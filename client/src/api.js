const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${text}`.trim());
  }
  return res.status === 204 ? null : res.json();
}

function get(path, opts = {}) {
  return fetch(`${BASE}${path}`, {
    method: "GET",
    credentials: "include",
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

export const api = {
  // Auth
  me:    () => get("/api/auth/me"),
  login: (email, password) => post("/api/auth/login", { email, password }),
  logout: () => post("/api/auth/logout", {}),

  // Services
  services: () => get("/api/services"),
  service:  (id) => get(`/api/services/${id}`),

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

export const whoAmI = () => api.me();
export const adminLogout = () => api.logout();