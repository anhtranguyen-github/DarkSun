import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8 animate-fade-in">
            <div className="relative mb-12">
                <div className="text-[12rem] font-black leading-none text-primary-500/10 select-none">404</div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary-600 p-6 rounded-[2rem] shadow-2xl shadow-primary-500/30 -rotate-6 animate-bounce-slow">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
            </div>

            <h1 className="text-5xl font-outfit font-black text-white mb-6">Trang không tồn tại</h1>
            <p className="text-dark-400 font-medium max-w-lg mx-auto mb-12 text-lg">
                Đường dẫn bạn đang truy cập không khớp với bất kỳ tọa độ nào trong hệ thống quản lý BlueMoon. Hãy kiểm tra lại URL hoặc quay về trung tâm điều khiển.
            </p>

            <Link to="/dashboard" className="premium-button-primary px-12 py-4 text-sm">
                Trở về Bảng điều khiển
            </Link>
        </div>
    );
};

export default NotFoundPage;
