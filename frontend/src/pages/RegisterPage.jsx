import React, { useState, useEffect } from 'react'; // Thêm useEffect
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { getAllRoles } from '../services/roleService'; // Import service mới
import './RegisterPage.css';

const RegisterPage = () => {
  // State cho form
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(''); // State cho vai trò được chọn

  // State quản lý UI
  const [roles, setRoles] = useState([]); // State để lưu danh sách vai trò
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Dùng useEffect để tải danh sách vai trò khi component được render
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getAllRoles();
        setRoles(response.data.data);
      } catch (err) {
        console.error("Không thể tải danh sách vai trò:", err);
        setError("Lỗi tải dữ liệu vai trò từ server.");
      }
    };
    fetchRoles();
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError("Vui lòng chọn vai trò của bạn.");
      return;
    }
    
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Gửi cả roleId khi đăng ký
      await register({ username, password, fullName, roleId: selectedRole });
      
      setMessage('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Tạo tài khoản BlueMoon</h2>
        {/* Các input field cho username, fullName, password giữ nguyên */}
        <div className="input-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="fullName">Họ và tên</label>
          <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Mật khẩu</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        {/* THÊM DROPDOWN CHỌN VAI TRÒ */}
        <div className="input-group">
          <label htmlFor="role">Vai trò của bạn</label>
          <select id="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} required>
            <option value="" disabled>-- Vui lòng chọn --</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
        <p className="redirect-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;