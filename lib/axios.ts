import axios from "axios";

// Mengambil URL dari environment variables, dengan fallback localhost
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menyisipkan token otomatis di setiap request
api.interceptors.request.use(
  (config) => {
    // TODO: Sesuaikan dengan cara Anda menyimpan token (localStorage / Cookies)
    let token = null;

    // Pengecekan agar aman saat dirender di server (Next.js)
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
