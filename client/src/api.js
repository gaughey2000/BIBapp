// client/src/api.js
const BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
const json = (res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

function withOpts(method = "GET", body) {
  const init = {
    method,
    credentials: "include", // <- send cookies cross-site
    headers: { "Content-Type": "application/json" },
  };
  if (body !== undefined) init.body = JSON.stringify(body);
  return init;
}

// ---------- public ----------
export async function fetchServices() {
  return fetch(`${BASE}/api/services`, { credentials: "include" }).then(json);
}

export async function fetchService(id) {
  return fetch(`${BASE}/api/services/${id}`, { credentials: "include" }).then(json);
}

export async function fetchAvailability({ serviceId, date }) {
  const url = new URL(`${BASE}/api/availability`);
  url.searchParams.set("serviceId", String(serviceId));
  url.searchParams.set("date", date); // yyyy-mm-dd
  return fetch(url, { credentials: "include" }).then(json);
}

export async function createBooking(input) {
  return fetch(`${BASE}/api/bookings`, withOpts("POST", input)).then(json);
}

// ---------- auth / admin ----------
export async function adminLogin({ email, password }) {
  return fetch(`${BASE}/api/auth/login`, withOpts("POST", { email, password })).then(json);
}

export async function adminLogout() {
  return fetch(`${BASE}/api/auth/logout`, withOpts("POST")).then(json);
}

export async function whoAmI() {
  return fetch(`${BASE}/api/auth/me`, { credentials: "include" }).then(json);
}

export async function fetchAdminBookings({ from, to } = {}) {
  const url = new URL(`${BASE}/api/admin/bookings`);
  if (from) url.searchParams.set("from", from);
  if (to) url.searchParams.set("to", to);
  return fetch(url, { credentials: "include" }).then(json);
}

export async function adminCancel(bookingId) {
  return fetch(`${BASE}/api/admin/bookings/${bookingId}/cancel`, withOpts("POST")).then(json);
}