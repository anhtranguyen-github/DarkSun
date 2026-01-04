import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/dashboardService';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data.data);
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê từ máy chủ.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, colorClass, trend }) => (
    <div className="glass-card p-6 rounded-2xl hover:border-primary-500/30 transition-all group overflow-hidden relative">
      {/* Glow effect on hover */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity bg-${colorClass}-500`}></div>

      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-${colorClass}-500/10 text-${colorClass}-400 ring-1 ring-inset ring-${colorClass}-500/20 shadow-inner`}>
          <div className="w-6 h-6">{icon}</div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-3xl font-outfit font-black tracking-tight text-white leading-none">
          {loading ? (
            <div className="h-8 w-24 bg-white/5 rounded-md animate-pulse"></div>
          ) : (
            value?.toLocaleString() || '0'
          )}
        </h3>
        <p className="text-sm font-semibold text-dark-400 tracking-wide uppercase">{title}</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse"></div>
        <div className="h-5 w-96 bg-white/5 rounded-lg animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card h-40 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-5xl font-outfit font-black text-white tracking-tight">
            Tổng quan hệ thống
          </h1>
          <p className="text-dark-400 text-lg max-w-2xl font-medium">
            Dữ liệu thời gian thực cho chung cư <span className="text-primary-400">BlueMoon Residence</span>.
          </p>
        </div>
        <div className="flex gap-3">

          <button className="premium-button-primary py-2.5 px-4 text-sm">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Thu phí mới
          </button>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-400 font-medium">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Hộ khẩu"
          value={stats?.totalHouseholds}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>}
          colorClass="primary"
        />
        <StatCard
          title="Cư dân"
          value={stats?.totalResidents}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
          colorClass="indigo"
        />
        <StatCard
          title="Phương tiện"
          value={stats?.totalVehicles}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>}
          colorClass="rose"
        />
        <StatCard
          title="Phí đang thu"
          value={stats?.activeFeePeriods}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
          colorClass="emerald"
        />
      </div>


    </div>
  );
};

export default DashboardPage;