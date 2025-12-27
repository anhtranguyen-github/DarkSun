import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Giả sử đã có file Sidebar.jsx
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;