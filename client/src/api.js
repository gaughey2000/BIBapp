import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

// Public: list all active services
export async function fetchServices() {
  const { data } = await api.get("/api/services");
  return data;
}

// Public: get availability slots for a service/date
export async function fetchAvailability(serviceId, dateStr) {
  const { data } = await api.get("/api/availability", {
    params: { serviceId, date: dateStr },
  });
  return data; // array of ISO strings (UTC)
}

// Public: create a booking
export async function createBooking(payload) {
  const { data } = await api.post("/api/bookings", payload);
  return data; // { booking_id, cancel_token, starts_at, ends_at }
}

// Admin: login
export async function adminLogin(email, password) {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
}

// Admin: who am I
export async function whoAmI() {
  const { data } = await api.get("/api/auth/me");
  return data;
}

// Admin: list bookings
export async function fetchAdminBookings(params = {}) {
  const { data } = await api.get("/api/admin/bookings", { params });
  return data;
}

// Admin: cancel booking
export async function adminCancel(booking_id) {
  const { data } = await api.post(`/api/admin/bookings/${booking_id}/cancel`);
  return data;
}

// Admin: logout
export async function adminLogout() {
  const { data } = await api.post("/api/auth/logout");
  return data;
}

// Admin: list blackouts
export async function adminListBlackouts(params = {}) {
  const { data } = await api.get("/api/admin/blackouts", { params });
  return data;
}

// Admin: create blackout
export async function adminCreateBlackout(payload) {
  const { data } = await api.post("/api/admin/blackouts", payload);
  return data;
}

// Admin: delete blackout
export async function adminDeleteBlackout(id) {
  const { data } = await api.delete(`/api/admin/blackouts/${id}`);
  return data;
}

// Public: fetch a single service detail
export async function fetchService(id) {
  const { data } = await api.get(`/api/services/${id}`); // fixed: added /api
  return data;
}