import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Giả sử context ở src/context/AuthContext.js
import { useApiError } from '../hooks/useApiError'; // Import hook for error handling
import './LoginPage.css'; // File CSS

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { handleError, handleSuccess } = useApiError();

  // Use refs to avoid stale closures
  const handleSuccessRef = useRef(handleSuccess);
  const handleErrorRef = useRef(handleError);

  useEffect(() => {
    handleSuccessRef.current = handleSuccess;
    handleErrorRef.current = handleError;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(username, password);
      handleSuccessRef.current('Đăng nhập thành công! Chào mừng bạn quay trở lại.');
      navigate('/dashboard'); // Điều hướng đến trang dashboard sau khi thành công
    } catch (err) {
      // Get error message from parsed error or response
      const errorMessage = err.parsedError?.message ||
        err.response?.data?.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(errorMessage);
      handleErrorRef.current(err, { showToast: false }); // Log error but don't show toast (we show inline error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Đăng nhập BlueMoon</h2>
        <div className="input-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
        <p className="redirect-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;