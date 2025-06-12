// src/api.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  withCredentials: true, // Send cookies for sessions
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ✅ Optional: Request interceptor (e.g., log requests or attach headers)
api.interceptors.request.use(
  (config) => {
    // You can log or modify the request here if needed
    // Example: attach extra headers
    // config.headers['X-Custom-Header'] = 'value';
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errMsg = error?.response?.data?.msg || error.message;
    console.error('API error:', errMsg);

    // Optional: redirect to login if unauthorized
    if (error?.response?.status === 401) {
      window.location.href = '/student/login';
    }

    return Promise.reject(error);
  }
);
// Add below your existing axios config in api.js
export const getStudentProfile = () => api.get("/api/profile/me");

export const logoutStudent = () => api.post("/api/students/logout");


export default api;
