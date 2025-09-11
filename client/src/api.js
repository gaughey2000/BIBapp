import axios from "axios";

const fromEnv = import.meta.env.VITE_API_URL; // e.g. https://bibappserver.onrender.com
const base = fromEnv?.replace(/\/$/, "") || window.location.origin.replace(/\/$/, "");

export const api = axios.create({
  baseURL: base,           // no /api here
  withCredentials: true,   // important for cookies
});

// --- Public endpoints
export async function fetchServices() {
  const { data } = await api.get("/api/services"); // add /api here
  return data;
}

export async function fetchService(id) {
  const { data } = await api.get(`/api/services/${id}`);
  return data;
}

export async function fetchAvailability(serviceId, dateStr) {
  const { data } = await api.get("/api/availability", { params: { serviceId, date: dateStr } });
  return data;
}

export async function createBooking(payload) {
  const { data } = await api.post("/api/bookings", payload);
  return data;
}

// --- Admin/auth
export async function adminLogin(email, password) {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
}
export async function whoAmI() {
  const { data } = await api.get("/api/auth/me");
  return data;
}
export async function adminLogout() {
  const { data } = await api.post("/api/auth/logout");
  return data;
}
export async function fetchAdminBookings(params = {}) {
  const { data } = await api.get("/api/admin/bookings", { params });
  return data;
}
export async function adminCancel(booking_id) {
  const { data } = await api.post(`/api/admin/bookings/${booking_id}/cancel`);
  return data;
}
export async function adminListBlackouts(params = {}) {
  const { data } = await api.get("/api/admin/blackouts", { params });
  return data;
}
export async function adminCreateBlackout(payload) {
  const { data } = await api.post("/api/admin/blackouts", payload);
  return data;
}
export async function adminDeleteBlackout(id) {
  const { data } = await api.delete(`/api/admin/blackouts/${id}`);
  return data;
}