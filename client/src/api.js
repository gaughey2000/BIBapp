import axios from "axios";

const base =
  import.meta.env.VITE_API_URL ?? // e.g. "http://localhost:4000" or Render URL
  (window.location.origin.replace(/\/$/, "") + "/api"); // dev proxy or same-origin

export const api = axios.create({
  baseURL: base,
  withCredentials: true,
});

// ---- Public ----

// List all active services  -> ALWAYS return an array
export async function fetchServices() {
  const { data } = await api.get("/services"); // << was "/api/services"
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.services)) return data.services;
  return [];
}

export async function fetchService(id) {
  const { data } = await api.get(`/services/${id}`); // << was `/api/services/${id}`
  return data;
}

export async function fetchAvailability(serviceId, dateStr) {
  const { data } = await api.get("/availability", { params: { serviceId, date: dateStr } }); // << was "/api/availability"
  return Array.isArray(data) ? data : [];
}

export async function createBooking(payload) {
  const { data } = await api.post("/bookings", payload); // << was "/api/bookings"
  return data; // { booking_id, cancel_token, starts_at, ends_at }
}

// ---- Admin ----
export async function adminLogin(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { email }
}

export async function whoAmI() {
  const { data } = await api.get("/auth/me");
  return data; // { email, role }
}

export async function adminLogout() {
  const { data } = await api.post("/auth/logout");
  return data; // { ok: true }
}

export async function fetchAdminBookings(params = {}) {
  const { data } = await api.get("/admin/bookings", { params }); // << was "/api/admin/bookings"
  return Array.isArray(data) ? data : [];
}

export async function adminCancel(booking_id) {
  const { data } = await api.post(`/admin/bookings/${booking_id}/cancel`); // << was "/api/..."
  return data;
}

export async function adminListBlackouts(params = {}) {
  const { data } = await api.get("/admin/blackouts", { params }); // << was "/api/..."
  return Array.isArray(data) ? data : [];
}

export async function adminCreateBlackout(payload) {
  const { data } = await api.post("/admin/blackouts", payload); // << was "/api/..."
  return data;
}

export async function adminDeleteBlackout(id) {
  const { data } = await api.delete(`/admin/blackouts/${id}`); // << was "/api/..."
  return data;
}