import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Thiếu mã xác thực (Token). Vui lòng kiểm tra lại liên kết.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setStatus('error');
            setMessage('Mật khẩu xác nhận không khớp.');
            return;
        }

        if (newPassword.length < 6) {
            setStatus('error');
            setMessage('Mật khẩu phải từ 6 ký tự trở lên.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            const response = await apiClient.post('/auth/reset-password', { token, newPassword });
            setStatus('success');
            setMessage(response.data.message);
            // Redirect after 3 seconds
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Có lỗi xảy ra. Token có thể đã hết hạn.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-md p-8 glass-card rounded-2xl shadow-2xl relative z-10 animate-fade-in-up">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black font-outfit bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-purple-400">
                        Đặt Lại Mật Khẩu
                    </h2>
                    <p className="text-dark-400 mt-2 text-sm">Vui lòng nhập mật khẩu mới của bạn.</p>
                </div>

                {status === 'success' ? (
                    <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-xl space-y-4">
                        <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-green-400">Thành công!</h3>
                        <p className="text-dark-300 text-sm">{message}</p>
                        <p className="text-xs text-dark-500">Đang chuyển hướng về trang đăng nhập...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {status === 'error' && (
                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm font-medium text-center">
                                {message}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-dark-400 ml-1">Mật khẩu mới</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="premium-input bg-dark-900/50"
                                placeholder="******"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-dark-400 ml-1">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="premium-input bg-dark-900/50"
                                placeholder="******"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full premium-button-primary py-3 text-sm"
                        >
                            {status === 'loading' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Đang xử lý...
                                </span>
                            ) : (
                                "Đổi mật khẩu"
                            )}
                        </button>
                        <div className="text-center mt-6">
                            <Link to="/login" className="text-sm text-dark-400 hover:text-white transition-colors font-medium">
                                ← Quay lại đăng nhập
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
