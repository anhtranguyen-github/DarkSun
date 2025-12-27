'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PeriodFee extends Model {
    static associate(models) {
      this.belongsTo(models.FeePeriod, { foreignKey: 'fee_period_id' });
      this.belongsTo(models.FeeType, { foreignKey: 'fee_type_id' });
    }
  }
  PeriodFee.init({
    feePeriodId: { type: DataTypes.INTEGER, field: 'fee_period_id', allowNull: false },
    feeTypeId: { type: DataTypes.INTEGER, field: 'fee_type_id', allowNull: false },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    description: { type: DataTypes.TEXT },
    type: { type: DataTypes.ENUM('Bắt buộc', 'Đóng góp'), defaultValue: 'Bắt buộc' },
  }, {
    sequelize,
    modelName: 'PeriodFee',
    tableName: 'period_fees',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return PeriodFee;
};