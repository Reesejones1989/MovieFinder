// frontend/src/api/axios.js
import axios from "axios";

// Use environment variable or default to localhost
const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
baseURL: BASE_URL + "/api"
});

// Automatically attach JWT token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
