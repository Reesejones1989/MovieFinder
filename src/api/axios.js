// frontend/src/api/axios.js
import axios from "axios";
import { auth } from "../components/firebaseConfig.jsx";

// Use environment variable or default to localhost
const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
baseURL: BASE_URL + "/api"
});

// Automatically attach the current user's Firebase ID token so the backend
// (authMiddleware.js) can verify who's making the request and tie data
// (favorites, etc.) to their account rather than a device.
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
