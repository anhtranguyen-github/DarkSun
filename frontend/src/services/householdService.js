import apiClient from './api';

// Sửa lại hàm này để chấp nhận object filters
export const getAllHouseholds = (filters = {}) => {
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v)
  );
  return apiClient.get('/households', { params: activeFilters });
};

export const createHousehold = (data) => apiClient.post('/households', data);
export const updateHousehold = (id, data) => apiClient.put(`/households/${id}`, data);
export const deleteHousehold = (id) => apiClient.delete(`/households/${id}`);