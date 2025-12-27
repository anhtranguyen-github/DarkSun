import React from 'react';
import Card from '../common/Card';
import './StatCard.css';

const StatCard = ({ title, value, icon }) => {
  return (
    <Card className="stat-card">
      {/* Icon có thể thêm sau */}
      <p className="stat-card-title">{title}</p>
      <h3 className="stat-card-value">{value}</h3>
    </Card>
  );
};

export default StatCard;