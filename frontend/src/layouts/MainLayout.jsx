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

        {/* Footer Info */}
        <footer className="relative z-10 px-8 py-6 border-t border-white/5 bg-dark-950/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-dark-500 text-xs font-medium">
              &copy; 2024 BlueMoon Residence Management. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-dark-500 hover:text-dark-300 text-xs transition-colors">Documentation</a>
              <a href="#" className="text-dark-500 hover:text-dark-300 text-xs transition-colors">Support</a>
              <span className="text-dark-600 text-[10px] py-1 px-2 border border-white/5 rounded mx-2">v2.0.4-stable</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default MainLayout;