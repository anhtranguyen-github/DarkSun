import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { getAllRoles } from '../services/roleService';

const ROLE_NAMES = {
  'admin': 'Quản Trị Viên',
  'manager': 'Tổ Trưởng',
  'deputy': 'Tổ Phó',
  'accountant': 'Kế Toán',
  'resident': 'Cư Dân'
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    roleId: ''
  });

  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getAllRoles()
      .then(res => {
        console.log("Roles fetched:", res.data.data);
        setRoles(res.data.data);
        // Auto-select Resident role
        const residentRole = res.data.data.find(r => r.name === 'resident');
        if (residentRole) {
          setFormData(prev => ({ ...prev, roleId: residentRole.id }));
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Lỗi tải danh sách vai trò.");
      });
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.roleId) {
      setError("Hệ thống chưa tải xong vai trò Cư Dân. Vui lòng thử tải lại trang.");
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await register(formData);
      setMessage('Đăng ký tài khoản thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tạo tài khoản, vui lòng thử tên đăng nhập khác.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-dark-950 font-sans selection:bg-primary-500/30">
      {/* Form Section - Left Side */}
      <div className="w-full lg:w-[480px] flex items-center justify-center p-8 bg-dark-900 border-r border-white/5 relative z-10">
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          <div className="space-y-2">
            <Link to="/login" className="text-primary-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:translate-x-[-4px] transition-transform w-fit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
              Quay lại đăng nhập
            </Link>
            <h2 className="text-3xl font-outfit font-black text-white">Tham gia BlueMoon</h2>
            <p className="text-dark-400 text-sm">Điền thông tin bên dưới để đăng ký tài khoản Cư Dân mới.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold flex gap-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
                {error}
              </div>
            )}

            {message && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold flex gap-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                {message}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Tên đăng nhập*</label>
                <input name="username" value={formData.username} onChange={handleChange} required className="premium-input bg-dark-950/40" placeholder="VD: annguyen123" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Họ và tên*</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} required className="premium-input bg-dark-950/40" placeholder="Nguyễn Văn A" />
              </div>

              {/* Role selection hidden - auto select Resident */}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-dark-500 uppercase tracking-widest ml-1">Mật khẩu*</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} required className="premium-input bg-dark-950/40" placeholder="••••••••" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-white text-dark-950 hover:bg-dark-100 font-black rounded-xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 mt-4 uppercase tracking-widest text-sm"
            >
              {isLoading ? 'Đang khởi tạo...' : 'Xác nhận đăng ký'}
            </button>
          </form>
        </div>
      </div>

      {/* Visual Section - Right Side */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden bg-gradient-to-bl from-dark-950 via-dark-900 to-primary-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary-600/10 blur-[100px] animate-pulse"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
        </div>

        <div className="relative z-10 text-center space-y-8">
          <div className="inline-block px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            Secure Access
          </div>
          <h1 className="text-6xl font-outfit font-black text-white leading-tight">
            Kiến tạo cuộc sống<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">thông minh hơn.</span>
          </h1>
          <p className="text-lg text-dark-400 max-w-md mx-auto font-medium">
            Tham gia vào hệ sinh thái quản lý chung cư hiện đại nhất Việt Nam. Tiết kiệm thời gian, tối ưu quy trình.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;