import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.roles?.includes('Admin');
  const isAccountant = user?.roles?.includes('Kế toán');
  const isManager = user?.roles?.includes('Tổ trưởng') || user?.roles?.includes('Tổ phó');
  // Bất kỳ ai có tài khoản đều là Cư dân và có thể xem hóa đơn của mình
  const isResident = user?.roles?.length > 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">BlueMoon</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {/* Link chung */}
          <li><NavLink to="/dashboard"><span>Thống kê</span></NavLink></li>
          
          {/* Link chỉ dành cho Cư dân (bao gồm cả Tổ trưởng, Kế toán, Admin) */}
          <li><NavLink to="/my-invoices"><span>Phí & Hóa đơn</span></NavLink></li>
          {/* Link chỉ dành cho Kế toán và Admin */}
          {(isAccountant || isAdmin) && (
            <>
              <li><NavLink to="/fee-types"><span>Quản lý Loại phí</span></NavLink></li>
              <li><NavLink to="/fee-periods"><span>Quản lý Đợt thu</span></NavLink></li>
            </>
          )}
          
          {/* Link chỉ dành cho Quản lý Cộng đồng và Admin */}
          {(isManager || isAdmin) && (
            <>
              <li><NavLink to="/households"><span>Quản lý Hộ khẩu</span></NavLink></li>
              <li><NavLink to="/users"><span>Quản lý Tài khoản</span></NavLink></li>
              <li><NavLink to="/resident-stats"><span>Thống kê Nhân khẩu</span></NavLink></li>
              <li><NavLink to="/household-stats"><span>Thống kê Hộ khẩu</span></NavLink></li>
              <li><NavLink to="/resident-search"><span>Truy vấn Nhân khẩu</span></NavLink></li>
              <li><NavLink to="/household-search"><span>Truy vấn Hộ khẩu</span></NavLink></li>
              <li><NavLink to="/residents"><span>Quản lý Nhân khẩu</span></NavLink></li>
            </> 
          )}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
      </div>
    </aside>
  );
};

export default Sidebar;