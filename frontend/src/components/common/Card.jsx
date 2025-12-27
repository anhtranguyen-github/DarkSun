import React from 'react';
import './Card.css'; // Sẽ tạo file CSS nhỏ cho Card

const Card = ({ children, className = '' }) => {
  return <div className={`common-card ${className}`}>{children}</div>;
};

export default Card;