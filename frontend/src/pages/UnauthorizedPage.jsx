import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>403 - Không có quyền truy cập</h1>
      <p>Bạn không có quyền để xem trang này.</p>
      <Link to="/dashboard">Quay về trang chủ</Link>
    </div>
  );
};

export default UnauthorizedPage;