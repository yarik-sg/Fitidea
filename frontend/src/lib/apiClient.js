import axios from "axios";

// Resolve base URL from env vars. Project defines `VITE_API_BASE_URL` in `.env`.
const base = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:8000";
const prefix = import.meta.env.VITE_API_PREFIX || "/api";

const normalizedBase = base.replace(/\/+$/, "");
const normalizedPrefix = prefix.startsWith("/") ? prefix : `/${prefix}`;

const apiClient = axios.create({
  baseURL: `${normalizedBase}${normalizedPrefix}`,
});

authInterceptor(apiClient);

function authInterceptor(client) {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

export default apiClient;
