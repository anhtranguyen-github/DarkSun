import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.parsedError?.message ||
        'Tên đăng nhập hoặc mật khẩu không đúng.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-950 font-sans selection:bg-primary-500/30">
      {/* Visual Section - Left Side */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-600/10 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px] animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <h1 className="text-7xl font-outfit font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-primary-400">
            BlueMoon
          </h1>
          <p className="text-xl text-dark-300 font-light leading-relaxed">
            Hệ thống quản lý chung cư thông minh, an toàn và tinh tế. Chăm sóc cộng đồng của bạn bằng công nghệ hiện đại.
          </p>
          <div className="pt-8 flex gap-4">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm text-sm text-dark-200">
              ✨ Quản lý tập trung
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm text-sm text-dark-200">
              🛡️ Bảo mật tuyệt đối
            </div>
          </div>
        </div>
      </div>

      {/* Form Section - Right Side */}
      <div className="w-full lg:w-[480px] flex items-center justify-center p-8 bg-dark-900 relative">
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-3xl font-outfit font-bold text-white">Đăng nhập</h2>
            <p className="text-dark-400">Chào mừng bạn trở lại, vui lòng điền thông tin đăng nhập.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-dark-300 ml-1">Tên đăng nhập</label>
                <input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  className="premium-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-dark-300 ml-1">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="premium-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-dark-700 bg-dark-950 text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-900" />
                <span className="text-dark-400 group-hover:text-dark-300 transition-colors">Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/forgot-password" title="Chức năng đang phát triển" className="text-primary-400 hover:text-primary-300 transition-colors">Quên mật khẩu?</Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-950/50 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Đang xử lý...
                </>
              ) : (
                'Đăng nhập vào hệ thống'
              )}
            </button>

            <div className="pt-4 text-center">
              <p className="text-dark-400 text-sm">
                Chưa có tài khoản? <Link to="/register" className="text-primary-400 font-bold hover:text-primary-300 transition-colors ml-1">Đăng ký tài khoản mới</Link>
              </p>
            </div>
          </form>
        </div>

        <div className="absolute bottom-8 text-dark-600 text-[10px] uppercase tracking-[0.2em]">
          BlueMoon Dashboard v2.0 &copy; 2024
        </div>
      </div>
    </div>
  );
};

export default LoginPage;