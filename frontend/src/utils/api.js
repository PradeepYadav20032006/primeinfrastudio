import axios from 'axios';

// Centralized axios instance. In dev, Vite proxies /api to the backend (see vite.config.js).
// In production, set VITE_API_URL to the deployed backend URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Attach JWT token from localStorage (if present) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pis_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error normalizer
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      'Something went wrong. Please try again.';
    return Promise.reject({ ...error, message });
  }
);

export default api;
