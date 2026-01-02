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
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'FeePeriod',
    tableName: 'fee_periods',
    underscored: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
  return FeePeriod;
};