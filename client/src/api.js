// client/src/api.js
const BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

// --- token storage for Safari/strict browsers ---
const TOKEN_KEY = "bib_admin_token";
function getToken() {
  try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
}
function setToken(t) {
  try { 
    t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY); 
  } catch (error) {
    console.warn('Failed to access sessionStorage:', error.message);
  }
}

const json = async (res) => {
  if (!res.ok) {
    // Try to get error details from response
    let errorMessage = `HTTP ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // If we can't parse JSON, use status text
      errorMessage = res.statusText || errorMessage;
    }
    
    const error = new Error(errorMessage);
    error.status = res.status;
    error.response = res;
    throw error;
  }
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

// Enhanced fetch wrapper with better error handling
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, options);
    return await json(response);
  } catch (error) {
    // Handle network errors
    if (!navigator.onLine) {
      const offlineError = new Error("No internet connection. Please check your network and try again.");
      offlineError.type = "NETWORK_ERROR";
      throw offlineError;
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new Error("Unable to connect to server. Please try again later.");
      networkError.type = "NETWORK_ERROR"; 
      throw networkError;
    }
    
    // Re-throw other errors as-is
    throw error;
  }
}

// ---------- public ----------
export async function fetchServices() {
  return apiCall(`${BASE}/api/services`, withOpts());
}
export async function fetchService(id) {
  return apiCall(`${BASE}/api/services/${id}`, withOpts());
}
export async function fetchAvailability(arg1, arg2) {
  // Accept either: (serviceId, date) OR ({ serviceId, date })
  const serviceId = typeof arg1 === "object" ? arg1.serviceId : arg1;
  const date = typeof arg1 === "object" ? arg1.date : arg2;

  // Validate inputs early
  if (!Number.isInteger(Number(serviceId))) {
    throw new Error(`Invalid serviceId: ${serviceId}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
    throw new Error(`Invalid date (YYYY-MM-DD expected): ${date}`);
  }

  const url = new URL(`${BASE}/api/availability`);
  // 👇 camelCase to match your backend route
  url.searchParams.set("serviceId", String(serviceId));
  url.searchParams.set("date", String(date));

  // Public endpoint: no cookies/Authorization
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Availability HTTP ${res.status}`);
  }
  return res.json();
}
export async function createBooking(input) {
  return apiCall(`${BASE}/api/bookings`, withOpts("POST", input));
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
  const id = Number(bookingId);
  if (!Number.isInteger(id)) {
    throw new Error(`Invalid booking id: ${bookingId}`);
  }
  return fetch(`${BASE}/api/admin/bookings/${id}/cancel`, withOpts("POST")).then(json);
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