import apiClient from './api';

export const getAllUsers = (params = {}) => {
  // Axios sẽ tự động chuyển object params thành query string, ví dụ: ?username=test&status=active
  return apiClient.get('/users', { params });
};

export const createUser = (userData) => apiClient.post('/users', userData);

export const assignRole = (userId, roleId) => apiClient.post(`/users/${userId}/assign-role`, { roleId });



export const deleteUser = (userId) => apiClient.delete(`/users/${userId}`);

export const assignHousehold = (userId, householdId) => {
  // Gửi householdId, có thể là null
  return apiClient.put(`/users/${userId}/assign-household`, { householdId });
};