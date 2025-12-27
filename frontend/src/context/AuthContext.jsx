import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../services/authService'; // Import service

// 1. Tạo Context
const AuthContext = createContext();

// 2. Tạo Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Trạng thái loading để kiểm tra token lúc đầu

  useEffect(() => {
    // Khi app khởi động, kiểm tra xem có token trong localStorage không
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser && storedUser !== 'undefined') {
    try {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsAuthenticated(true);
    } catch (e) {
      // Nếu có lỗi parse, xóa dữ liệu hỏng
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
  setLoading(false);
}, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login({ username, password });
      // Giả sử API trả về { success, message, data: { token, user } }
      const { token, user } = response.data.data;

      // KIỂM TRA KỸ DỮ LIỆU TRƯỚC KHI LƯU
      if (token && user) {
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        // Nếu API trả về thành công nhưng thiếu token hoặc user, đó là một lỗi
        throw new Error('Dữ liệu đăng nhập không hợp lệ từ server.');
      }
      
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    // Xóa khỏi state và localStorage
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateAuthUser = (newUserData) => {
    // Cập nhật cả state và localStorage
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
    console.log("AuthContext user updated:", newUserData);
  };
  // 3. Cung cấp state và các hàm cho các component con
  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    updateAuthUser, // Thêm hàm mới vào value để cung cấp cho các component
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 4. Tạo một custom hook để dễ dàng sử dụng context
export const useAuth = () => {
  return useContext(AuthContext);
};