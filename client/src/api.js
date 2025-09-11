// client/src/api.js
const BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

// --- token storage for Safari/strict browsers ---
const TOKEN_KEY = "bib_admin_token";
function getToken() {
  try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
}
function setToken(t) {
  try { t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY); } catch {}
}

const json = (res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

function withOpts(method = "GET", body) {
  const headers = { "Content-Type": "application/json" };
  const t = getToken();
  if (t) headers["Authorization"] = `Bearer ${t}`;
  const init = { method, credentials: "include", headers };
  if (body !== undefined) init.body = JSON.stringify(body);
  return init;
}

// ---------- public ----------
export async function fetchServices() {
  return fetch(`${BASE}/api/services`, withOpts()).then(json);
}
export async function fetchService(id) {
  return fetch(`${BASE}/api/services/${id}`, withOpts()).then(json);
}
export async function fetchAvailability(serviceId, date) {
  const url = new URL(`${BASE}/api/availability`);
  url.searchParams.set("serviceId", String(serviceId));
  url.searchParams.set("date", date);
  return fetch(url, withOpts()).then(json);
}
export async function createBooking(input) {
  return fetch(`${BASE}/api/bookings`, withOpts("POST", input)).then(json);
}

// ---------- auth / admin ----------
// works with both adminLogin(email, password) and adminLogin({ email, password })
export async function adminLogin(emailOrObj, pw) {
  const email = typeof emailOrObj === "string" ? emailOrObj : emailOrObj?.email;
  const password = typeof emailOrObj === "string" ? pw : emailOrObj?.password;

  const data = await fetch(`${BASE}/api/auth/login`, withOpts("POST", { email, password })).then(json);
  if (data?.token) setToken(data.token);      // store for Safari
  return data;
}
export async function adminLogout() {
  setToken(null);
  return fetch(`${BASE}/api/auth/logout`, withOpts("POST")).then(json);
}
export async function whoAmI() {
  return fetch(`${BASE}/api/auth/me`, withOpts()).then(json);
}
export async function fetchAdminBookings({ from, to } = {}) {
  const url = new URL(`${BASE}/api/admin/bookings`);
  if (from) url.searchParams.set("from", from);
  if (to) url.searchParams.set("to", to);
  return fetch(url, withOpts()).then(json);
}
export async function adminCancel(bookingId) {
  return fetch(`${BASE}/api/admin/bookings/${bookingId}/cancel`, withOpts("POST")).then(json);
}
export async function adminListBlackouts({ from, to } = {}) {
  const url = new URL(`${BASE}/api/admin/blackouts`);
  if (from) url.searchParams.set("from", from);
  if (to) url.searchParams.set("to", to);
  return fetch(url, withOpts()).then(json);
}
export async function adminCreateBlackout(input) {
  return fetch(`${BASE}/api/admin/blackouts`, withOpts("POST", input)).then(json);
}
export async function adminDeleteBlackout(id) {
  return fetch(`${BASE}/api/admin/blackouts/${id}`, withOpts("DELETE")).then(json);
}