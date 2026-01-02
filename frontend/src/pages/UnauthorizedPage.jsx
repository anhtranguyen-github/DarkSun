import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 animate-fade-in">
      <div className="relative mb-8">
        <div className="text-[10rem] font-black leading-none text-rose-500/20 select-none">403</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-rose-500 p-4 rounded-3xl shadow-2xl shadow-rose-500/40 rotate-12">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 15v2m0 0v2m0-2h2m-2 0H10m10-5V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2v-5z" /></svg>
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-outfit font-black text-white mb-4">Truy cập bị từ chối</h1>
      <p className="text-dark-400 font-medium max-w-md mx-auto mb-10">
        Tài khoản của bạn không có đủ đặc quyền để khởi tạo hoặc xem dữ liệu tại phân khu này. Vui lòng liên hệ Quản trị viên nếu đây là một sự nhầm lẫn.
      </p>

      <div className="flex gap-4">
        <Link to="/dashboard" className="premium-button-primary px-10 py-3">
          Quay về Bảng điều khiển
        </Link>
        <button onClick={() => window.history.back()} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;