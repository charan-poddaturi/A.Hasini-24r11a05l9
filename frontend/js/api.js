const API_BASE_URL = "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("safehub_token");
}

function setToken(token) {
  localStorage.setItem("safehub_token", token);
}

function clearToken() {
  localStorage.removeItem("safehub_token");
}

function logout() {
  clearToken();
  window.location.href = "index.html";
}

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    // Check if unauthorized and redirect to login
    if (response.status === 401 || response.status === 403) {
      logout();
    }
    throw new Error(data.message || "API error occurred");
  }

  return data;
}

// Redirect if not logged in
function requireAuth() {
  if (!getToken()) {
    window.location.href = "index.html";
  }
}
