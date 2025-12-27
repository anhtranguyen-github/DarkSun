import React, { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import * as dashboardService from '../services/dashboardService';
import StatCard from '../components/dashboard/StatCard';
import RecentActivityFeed from '../components/dashboard/RecentActivityFeed';
import Spinner from '../components/common/Spinner';
import './DashboardPage.css';

const DashboardPage = () => {
  const {
    data: dashboardData,
    error,
    loading,
    request: fetchDashboardData
  } = useApi(dashboardService.getDashboardStats);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="error-message">Lỗi tải dữ liệu: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Thống kê</h1>
      <div className="stats-grid">
        <StatCard title="Dân cư" value={dashboardData?.residentCount ?? 0} />
        <StatCard title="Số hộ" value={dashboardData?.householdCount ?? 0} />
      </div>
      <div className="recent-updates-section">
        <RecentActivityFeed activities={dashboardData?.recentActivities ?? []} />
      </div>
    </div>
  );
};

export default DashboardPage;