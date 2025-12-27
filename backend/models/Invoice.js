'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      this.belongsTo(models.Household, { foreignKey: 'householdId' });
      this.belongsTo(models.FeePeriod, { foreignKey: 'feePeriodId' });
      this.hasMany(models.InvoiceDetail, { foreignKey: 'invoiceId' });
    }
  }
  Invoice.init({
    householdId: { type: DataTypes.INTEGER, allowNull: false, field: 'household_id' },
    feePeriodId: { type: DataTypes.INTEGER, allowNull: false, field: 'fee_period_id' },
    totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, field: 'total_amount' },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'unpaid' },
    //... thêm các trường khác
  }, {
    sequelize,
    modelName: 'Invoice',
    tableName: 'invoices',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Invoice;
};