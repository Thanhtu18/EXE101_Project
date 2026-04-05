import axios from "axios";

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Global Errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle Unauthorized (e.g., redirect to login)
      // Note: We avoid direct window.location if possible, 
      // but for a global interceptor it's sometimes necessary.
      // Alternatively, trigger a custom event or update a global store.
      console.error("Unauthorized! Redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default api;
