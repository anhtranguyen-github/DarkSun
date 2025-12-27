// services/residentService.js
import apiClient from './api';

export const getAllResidents = (filters = {}) => {
// Loại bỏ các filter rỗng để URL sạch sẽ
const activeFilters = Object.fromEntries(
Object.entries(filters).filter(([_, value]) => value)
);
// Axios sẽ tự động chuyển object thành query string, vd: ?fullName=Minh
return apiClient.get('/residents', { params: activeFilters });
};

export const getResidentsByHousehold = (householdId) => apiClient.get(`/residents/by-household/${householdId}`);

export const createResident = (data) => apiClient.post('/residents', data);
export const updateResident = (id, data) => apiClient.put(`/residents/${id}`, data);
export const deleteResident = (id) => apiClient.delete(`/residents/${id}`);