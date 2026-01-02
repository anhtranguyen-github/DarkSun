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
      type: DataTypes.ENUM('open', 'closed', 'pending'),
      defaultValue: 'open'
    },
    type: {
      type: DataTypes.ENUM('mandatory', 'contribution'),
      allowNull: false,
      defaultValue: 'mandatory'
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