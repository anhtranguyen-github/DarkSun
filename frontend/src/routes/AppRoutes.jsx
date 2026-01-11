import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Guards
import ProtectedRoute from './ProtectedRoute';
import RoleBasedGuard from './RoleBasedGuard';

// Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import UserManagementPage from '../pages/UserManagementPage';
import HouseholdManagementPage from '../pages/HouseholdManagementPage';
import FeeTypeManagement from '../pages/FeeTypeManagement';
import FeePeriodManagement from '../pages/FeePeriodManagement';
import FeePeriodDetailPage from '../pages/FeePeriodDetailPage';
import HouseholdStatsPage from '../pages/HouseholdStatsPage';
import ResidentManagementPage from '../pages/ResidentManagementPage';
import ResidentStatsPage from '../pages/ResidentStatsPage';
import ResidentSearchPage from '../pages/ResidentSearchPage';
import HouseholdSearchPage from '../pages/HouseholdSearchPage';
import MyInvoicesPage from '../pages/MyInvoicesPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="my-invoices" element={<MyInvoicesPage />} />

          {/* SỬ DỤNG CẤU TRÚC LỒNG NHAU Ở ĐÂY */}
          {/* Việc ai có quyền SỬA/XÓA sẽ do API ở backend quyết định */}
          <Route element={<RoleBasedGuard allowedRoles={['admin', 'accountant']} />}>
            <Route path="fee-types" element={<FeeTypeManagement />} />
            <Route path="fee-periods" element={<FeePeriodManagement />} />
            <Route path="fee-periods/:id" element={<FeePeriodDetailPage />} />
          </Route>

          {/* Nhóm route cho Quản lý Cộng đồng */}
          <Route element={<RoleBasedGuard allowedRoles={['manager', 'deputy', 'accountant']} />}>
            <Route path="households" element={<HouseholdManagementPage />} />
            <Route path="residents" element={<ResidentManagementPage />} />
            <Route path="resident-search" element={<ResidentSearchPage />} />
            <Route path="resident-stats" element={<ResidentStatsPage />} />
            <Route path="household-stats" element={<HouseholdStatsPage />} />
            <Route path="household-search" element={<HouseholdSearchPage />} />
          </Route>

          {/* Quản lý Người dùng - Chỉ Admin và Tổ Trưởng */}
          <Route element={<RoleBasedGuard allowedRoles={['admin', 'manager']} />}>
            <Route path="users" element={<UserManagementPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;