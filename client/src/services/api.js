import axios from 'axios';

// In dev, Vite proxies /api and /uploads to the Express server (see vite.config.js).
// In production, set VITE_API_URL to the deployed backend origin.
const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bakery-admin-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('bakery-admin-token');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper to build a full URL for an uploaded image path like "/uploads/xyz.jpg"
export function resolveImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${baseURL}${path}`;
}
