'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FeePeriod extends Model {
    static associate(models) {
      this.hasMany(models.Invoice, { foreignKey: 'fee_period_id' });
      this.hasMany(models.PeriodFee, { foreignKey: 'fee_period_id' });
    }
  }
  FeePeriod.init({
    name: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATE, field: 'start_date' },
    endDate: { type: DataTypes.DATE, field: 'end_date' },
     status: { 
      type: 'enum_fee_periods_status', // Dùng tên kiểu đã tạo trong CSDL
      defaultValue: 'Chưa bắt đầu' 
    },
    type: { 
      type: 'enum_fee_periods_type', // Dùng tên kiểu đã tạo trong CSDL
      allowNull: false,
      defaultValue: 'Bắt buộc'
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'FeePeriod',
    tableName: 'fee_periods',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return FeePeriod;
};