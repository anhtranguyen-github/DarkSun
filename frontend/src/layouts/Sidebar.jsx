import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Normalize roles to lowercase
  const userRoles = user?.roles?.map(r => r.toLowerCase()) || [];
  const isAdmin = userRoles.includes('admin');
  const isManager = userRoles.includes('manager');
  const isDeputy = userRoles.includes('deputy');
  // const isToTruong = isManager || isDeputy; // Use specific checks
  const isKeToan = userRoles.includes('accountant');
  const isResident = userRoles.includes('resident');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon, label, exact = false }) => (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-950/40'
          : 'text-dark-400 hover:bg-white/5 hover:text-dark-100'}
            `}
    >
      <span className="w-5 h-5 shrink-0">{icon}</span>
      <span className="font-medium text-sm tracking-wide truncate">{label}</span>
      {/* Active Indicator Pin */}
      <span className="ml-auto opacity-0 group-[.active]:opacity-100 transition-opacity">
        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
      </span>
    </NavLink>
  );

  return (
    <aside className="w-72 h-screen flex flex-col bg-dark-900 border-r border-white/5 sticky top-0 z-50 overflow-hidden shrink-0">
      {/* Sidebar Header */}
      <div className="h-20 flex items-center px-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <div className="w-3 h-3 bg-white rounded-sm rotate-45"></div>
          </div>
          <div className="text-2xl font-outfit font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-400">
            BlueMoon
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Dashboard - All users */}
        <div>
          <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] font-black text-dark-500 mb-4 opacity-50">Tổng quan</h3>
          <div className="space-y-1">
            <NavItem
              to="/dashboard"
              label="Bảng điều khiển"
              exact
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>}
            />
            {isResident && (
              <NavItem
                to="/my-invoices"
                label="Hóa đơn hộ khẩu"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>}
              />
            )}
          </div>
        </div>

        {/* People & House Management - Admin & Leaders */}
        {(isAdmin || isManager || isDeputy) && (
          <div>
            <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] font-black text-dark-500 mb-4 opacity-50">Quản lý dân cư</h3>
            <div className="space-y-1">
              <NavItem
                to="/households"
                label="Cơ sở dữ liệu Hộ khẩu"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>}
              />
              <NavItem
                to="/residents"
                label="Danh sách Nhân khẩu"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>}
              />
              <div className="pt-2">
                <NavItem
                  to="/resident-search"
                  label="Tra cứu cư dân"
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>}
                />
                <NavItem
                  to="/resident-stats"
                  label="Thống kê nhân khẩu"
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z" /></svg>}
                />
              </div>
            </div>
          </div>
        )}

        {/* Financial - Admin & Accountant */}
        {(isAdmin || isKeToan) && (
          <div>
            <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] font-black text-dark-500 mb-4 opacity-50">Tài chính & Thu phí</h3>
            <div className="space-y-1">
              <NavItem
                to="/fee-types"
                label="Danh mục Khoản thu"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
              />
              <NavItem
                to="/fee-periods"
                label="Quản lý Đợt thu"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
              />
              <NavItem
                to="/fee-stats"
                label="Thống kê Thu phí"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>}
              />
            </div>
          </div>
        )}

        {/* System Settings - Admin & Manager */}
        {(isAdmin || isManager) && (
          <div>
            <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] font-black text-dark-500 mb-4 opacity-50">Quản trị hệ thống</h3>
            <div className="space-y-1">
              <NavItem
                to="/users"
                label="Tài khoản người dùng"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="17" y1="11" x2="23" y2="11" /></svg>}
              />
            </div>
          </div>
        )}
      </nav>

      {/* Sidebar Footer - User Profile */}
      <div className="p-6 bg-dark-950/40 border-t border-white/5 space-y-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-primary-900/40">
            {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-black text-white truncate truncate">{user?.fullName || 'Người dùng'}</div>
            <div className="text-[10px] text-primary-400 font-black uppercase tracking-widest">{user?.roles?.[0] || 'Member'}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all text-xs font-black uppercase tracking-widest active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;