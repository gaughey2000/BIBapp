// client/src/api.js
const BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

// --- token storage ---
const TOKEN_KEY = "bib_admin_token";
function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
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
    let errorMessage = `HTTP ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
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

async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, options);
    return await json(response);
  } catch (error) {
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

    throw error;
  }
}

// ========== PUBLIC SERVICES ==========
export async function fetchServices() {
  return apiCall(`${BASE}/api/services`, withOpts());
}

export async function fetchService(id) {
  return apiCall(`${BASE}/api/services/${id}`, withOpts());
}

// ========== AUTH ==========
export async function login(email, password) {
  const d = await apiCall(`${BASE}/api/auth/login`, withOpts("POST", { email, password }));
  if (d.token) setToken(d.token);
  return d;
}

export async function whoAmI() {
  return apiCall(`${BASE}/api/auth/me`, withOpts());
}

export async function logout() {
  await apiCall(`${BASE}/api/auth/logout`, withOpts("POST"));
  setToken(null);
}

// ========== ADMIN - SERVICES ==========
export async function getAdminServices() {
  return apiCall(`${BASE}/api/admin/services`, withOpts());
}

export async function createService(data) {
  return apiCall(`${BASE}/api/admin/services`, withOpts("POST", data));
}

export async function updateService(id, data) {
  return apiCall(`${BASE}/api/admin/services/${id}`, withOpts("PUT", data));
}

export async function deleteService(id) {
  return apiCall(`${BASE}/api/admin/services/${id}`, withOpts("DELETE"));
}

// ========== CONTACT FORM ==========
export async function submitContactForm(name, email, message) {
  return apiCall(`${BASE}/api/contact`, withOpts("POST", { name, email, message }));
}

// Default export for backward compatibility
export default {
  fetchServices,
  fetchService,
  login,
  whoAmI,
  logout,
  getAdminServices,
  createService,
  updateService,
  deleteService,
  submitContactForm,
};
