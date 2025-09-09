// client/src/api.js
import axios from "axios";

/**
 * Base URL rules:
 * - In production on Render, set VITE_API_URL to: https://bibappserver.onrender.com/api
 * - In local dev, this falls back to http://localhost:4000/api
 */
function normalizeBase(url) {
  if (!url) return "http://localhost:4000/api";
  // remove trailing slashes then add exactly one "/api" if not present
  const u = url.replace(/\/+$/, "");
  return u.endsWith("/api") ? u : `${u}/api`;
}

const base = normalizeBase(import.meta.env.VITE_API_URL);
export const api = axios.create({
  baseURL: base,
  withCredentials: true, // needed for auth cookie
});

// ---- Public endpoints ----
export async function fetchServices() {
  const { data } = await api.get("/services");
  return data;
}

export async function fetchService(id) {
  const { data } = await api.get(`/services/${id}`);
  return data;
}

export async function fetchAvailability(serviceId, dateStr) {
  const { data } = await api.get("/availability", {
    params: { serviceId, date: dateStr },
  });
  return data; // array of UTC ISO strings
}

export async function createBooking(payload) {
  const { data } = await api.post("/bookings", payload);
  return data; // { booking_id, cancel_token, starts_at, ends_at }
}

// ---- Auth ----
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

// ---- Admin: bookings ----
export async function fetchAdminBookings(params = {}) {
  const { data } = await api.get("/admin/bookings", { params });
  return data;
}

export async function adminCancel(booking_id) {
  const { data } = await api.post(`/admin/bookings/${booking_id}/cancel`);
  return data; // { ok: true }
}

// ---- Admin: blackouts ----
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