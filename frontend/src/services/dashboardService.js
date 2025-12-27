import apiClient from './api';

export const getDashboardStats = () => {
  return apiClient.get('/dashboard/stats');
};