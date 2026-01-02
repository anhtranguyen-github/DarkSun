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
          <button className="premium-button-secondary py-2.5 px-4 text-sm">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Xuất báo cáo
          </button>
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
          trend={12}
        />
        <StatCard
          title="Cư dân"
          value={stats?.totalResidents}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
          colorClass="indigo"
          trend={5}
        />
        <StatCard
          title="Phương tiện"
          value={stats?.totalVehicles}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>}
          colorClass="rose"
          trend={-2}
        />
        <StatCard
          title="Phí đang thu"
          value={stats?.activeFeePeriods}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
          colorClass="emerald"
        />
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Overview Chart Area */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-outfit font-bold">Doanh thu thu phí</h3>
            <select className="bg-dark-950/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-dark-300 focus:outline-none">
              <option>Năm 2024</option>
              <option>Năm 2023</option>
            </select>
          </div>
          <div className="h-[320px] w-full flex items-center justify-center rounded-xl bg-dark-950/40 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 shimmer opacity-10"></div>
            <div className="flex flex-col items-center gap-4 text-center px-12 z-10">
              <div className="p-4 rounded-full bg-primary-500/10 text-primary-400 mb-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
              </div>
              <h4 className="text-white font-bold">Đang tải biểu đồ phân tích</h4>
              <p className="text-dark-500 text-sm">Hệ thống đang đồng bộ dữ liệu hóa đơn từ tất cả các hộ khẩu trong tòa nhà.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity & Staff */}
        <div className="space-y-8">
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-outfit font-bold flex items-center justify-between">
              Hoạt động gần đây
              <span className="text-[10px] text-primary-400 hover:underline cursor-pointer">Xem tất cả</span>
            </h3>
            <div className="space-y-4">
              {[
                { user: 'Ad', action: 'Duyệt tạm trú cho Hộ HK-102', time: '10 phút trước', type: 'info' },
                { user: 'KT', action: 'Ghi nhận đóng góp từ thiện đợt 2', time: '1 giờ trước', type: 'success' },
                { user: 'TT', action: 'Đăng ký xe máy mới cho KH-405', time: '3 giờ trước', type: 'info' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 bg-${item.type === 'success' ? 'emerald' : 'sky'}-500 shadow-[0_0_8px_rgba(var(--color-primary),0.5)]`}></div>
                  <div className="space-y-0.5">
                    <p className="text-sm text-dark-200 group-hover:text-white transition-colors">
                      <span className="font-bold text-primary-400">{item.user}</span>: {item.action}
                    </p>
                    <span className="text-[10px] text-dark-500 font-bold uppercase">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-outfit font-bold">Quản lý viên</h3>
            <div className="space-y-4">
              {[
                { name: 'Nguyễn Văn Admin', role: 'Quản trị viên', active: true },
                { name: 'Trần Thị Kế Toán', role: 'Kế toán trưởng', active: true },
                { name: 'Lê Văn Tổ Trưởng', role: 'Tổ trưởng tổ 2', active: false }
              ].map((staff, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-dark-700/50 flex items-center justify-center font-bold text-[10px] text-dark-300">
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">{staff.name}</div>
                    <div className="text-[10px] text-dark-500 font-medium uppercase tracking-tight">{staff.role}</div>
                  </div>
                  <div className={`h-1.5 w-1.5 rounded-full ${staff.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-dark-700'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;