import apiClient from './api';

// --- Fee Periods ---
export const getAllFeePeriods = () => apiClient.get('/fee-periods');
export const getFeePeriodById = (id) => apiClient.get(`/fee-periods/${id}`);
export const createFeePeriod = (data) => apiClient.post('/fee-periods', data);
export const updateFeePeriod = (id, data) => apiClient.put(`/fee-periods/${id}`, data);
export const deleteFeePeriod = (id) => apiClient.delete(`/fee-periods/${id}`);

// --- Actions ---
export const generateInvoicesForPeriod = (periodId, feeTypeId) => {
  return apiClient.post(`/fee-periods/${periodId}/generate-invoices`, { feeTypeId });
};
