import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner'; // Giả sử bạn có component này

const RoleBasedGuard = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // 1. Hiển thị spinner trong khi chờ xác thực
  if (loading) {
    return <Spinner />;
  }

  // 2. Nếu không xác thực, chuyển về trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Logic kiểm tra quyền hạn (Backend uses lowercase role names)
  const userRoles = user?.roles?.map(r => r.toLowerCase()) || [];
  const isAdmin = userRoles.includes('admin');

  // Cho phép truy cập nếu là Admin HOẶC có vai trò trong danh sách được phép
  const hasPermission = isAdmin || userRoles.some(role =>
    allowedRoles.map(r => r.toLowerCase()).includes(role)
  );

  if (!hasPermission) {
    console.warn(`Access denied. User roles: ${userRoles}, Allowed roles: ${allowedRoles}`);
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Nếu có quyền, render các Route con thông qua Outlet
  return <Outlet />;
};

export default RoleBasedGuard;