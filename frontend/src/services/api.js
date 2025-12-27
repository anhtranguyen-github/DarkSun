import axios from 'axios';
import { parseApiError, isAuthError } from '../utils/errorHandler';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000, // 30 second timeout
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Return successful response
    return response;
  },
  (error) => {
    // Parse the error for better messages
    const parsedError = parseApiError(error);

    // Attach parsed error info to the error object
    error.parsedError = parsedError;

    // Handle 401 Unauthorized - Clear localStorage and redirect to login
    if (isAuthError(error)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${parsedError.status}: ${parsedError.message}`, error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;