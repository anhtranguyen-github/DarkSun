// services/roleService.js
import apiClient from './api';

export const getAllRoles = () => {
  return apiClient.get('/roles');
};