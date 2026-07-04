import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000, // 15 detik timeout
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Sisipkan JWT Bearer token di setiap request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handle error global: 401 auto logout, 403 redirect forbidden
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        // Token expired / tidak valid → hapus token dan redirect ke login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Jangan reload/redirect jika sudah berada di halaman login
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      if (error.response?.status === 403) {
        // Tidak punya akses, kecuali error OUTLET_CLOSED yang dihandle di UI
        if ((error.response?.data as any)?.code !== "OUTLET_CLOSED") {
          window.location.href = "/forbidden";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
