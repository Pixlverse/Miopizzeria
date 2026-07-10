import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT (admin) token to every request when present.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("mio_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
