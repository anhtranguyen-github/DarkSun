import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-dark-950 font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto custom-scrollbar relative">
        {/* Background Decoration */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[60%] h-[40%] bg-primary-900/10 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-900/10 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4"></div>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 p-8 xl:p-12">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </div>


      </main>
    </div>
  );
};

export default MainLayout;