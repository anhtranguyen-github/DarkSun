// Thay đổi hoàn toàn file này
import apiClient from './api'; // Import apiClient đã có interceptor

export const login = (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

export const register = (userData) => {
  return apiClient.post('/auth/register', userData);
};