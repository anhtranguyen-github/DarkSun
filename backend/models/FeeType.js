'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FeeType extends Model {
    static associate(models) {
      this.hasMany(models.InvoiceDetail, { foreignKey: 'fee_type_id' });
      this.hasMany(models.PeriodFee, { foreignKey: 'fee_type_id' });
    }
  }
  FeeType.init({
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    unit: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    description: { type: DataTypes.TEXT },
  }, {
    sequelize,
    modelName: 'FeeType',
    tableName: 'fee_types',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return FeeType;
};