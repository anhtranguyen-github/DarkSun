import apiClient from './api';

// --- CÁC HÀM CRUD CHO LOẠI PHÍ ---

export const getAllFeeTypes = () => apiClient.get('/fee-types');

// SỬA Ở ĐÂY: Dùng dấu backtick ` thay vì /
export const getFeeTypeById = (id) => apiClient.get(`/fee-types/${id}`);

export const createFeeType = (feeTypeData) => apiClient.post('/fee-types', feeTypeData);

// SỬA Ở ĐÂY: Dùng dấu backtick ` thay vì /
export const updateFeeType = (id, feeTypeData) => apiClient.put(`/fee-types/${id}`, feeTypeData);

// SỬA Ở ĐÂY: Dùng dấu backtick ` thay vì /
export const deleteFeeType = (id) => apiClient.delete(`/fee-types/${id}`);