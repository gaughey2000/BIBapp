// client/src/api.js
import axios from "axios";

const root = import.meta.env.VITE_API_URL ?? window.location.origin;

export const api = axios.create({
  baseURL: root.replace(/\/$/, "") + "/api", // ⬅️ always append /api
  withCredentials: true,
});

// Public: list all active services
export async function fetchServices() {
  const { data } = await api.get("/services"); // ⬅️ no /api here
  return data;
}

export async function fetchAvailability(serviceId, dateStr) {
  const { data } = await api.get("/availability", { params: { serviceId, date: dateStr } });
  return data;
}

export async function createBooking(payload) {
  const { data } = await api.post("/bookings", payload);
  return data;
}

export async function adminLogin(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function whoAmI() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function fetchAdminBookings(params = {}) {
  const { data } = await api.get("/admin/bookings", { params });
  return data;
}

export async function adminCancel(booking_id) {
  const { data } = await api.post(`/admin/bookings/${booking_id}/cancel`);
  return data;
}

export async function adminLogout() {
  const { data } = await api.post("/auth/logout");
  return data;
}

export async function adminListBlackouts(params = {}) {
  const { data } = await api.get("/admin/blackouts", { params });
  return data;
}

export async function adminCreateBlackout(payload) {
  const { data } = await api.post("/admin/blackouts", payload);
  return data;
}

export async function adminDeleteBlackout(id) {
  const { data } = await api.delete(`/admin/blackouts/${id}`);
  return data;
}

export async function fetchService(id) {
  const { data } = await api.get(`/services/${id}`);
  return data;
}