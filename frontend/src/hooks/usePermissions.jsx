// src/hooks/usePermissions.js
import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  const isAdmin = user?.roles?.includes('Admin') || false;

  // Quyền quản lý tài chính
  const canManageFinance = isAdmin || user?.roles?.includes('Kế toán');

  // Quyền quản lý người dùng và hộ khẩu
  const canManageCommunity = isAdmin || user?.roles?.includes('Tổ trưởng') || user?.roles?.includes('Tổ phó');

  return {
    isAdmin,
    canManageFinance,
    canManageCommunity,
  };
};