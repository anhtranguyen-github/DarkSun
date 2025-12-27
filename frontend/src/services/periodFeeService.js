import apiClient from './api';

// Lấy tất cả các khoản thu trong một đợt thu
export const getFeesInPeriod = (feePeriodId) => {
  return apiClient.get(`/period-fees/in-period/${feePeriodId}`);
};

// Thêm một khoản thu mới vào đợt thu
export const addFeeToPeriod = (feePeriodId, data) => {
  return apiClient.post(`/period-fees/in-period/${feePeriodId}`, data);
};

// Cập nhật một khoản thu cụ thể
export const updateFeeInPeriod = (periodFeeId, data) => {
  return apiClient.put(`/period-fees/${periodFeeId}`, data);
};

// Xóa một khoản thu cụ thể
export const deleteFeeInPeriod = (periodFeeId) => {
  return apiClient.delete(`/period-fees/${periodFeeId}`);
};