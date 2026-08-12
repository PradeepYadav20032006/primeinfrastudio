import axios from 'axios';

// Separate axios instance for customer-facing requests. Uses its own token
// storage key ('pis_customer_token') so a customer login and an admin login
// can coexist in the same browser without overwriting each other's session.
const customerApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

customerApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('pis_customer_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

customerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      'Something went wrong. Please try again.';
    return Promise.reject({ ...error, message });
  }
);

export default customerApi;
