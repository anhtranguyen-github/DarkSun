'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      this.belongsTo(models.Household, { foreignKey: 'householdId' });
      this.belongsTo(models.FeePeriod, { foreignKey: 'feePeriodId' });
      this.hasMany(models.InvoiceDetail, { foreignKey: 'invoiceId' });
      this.belongsTo(models.User, { foreignKey: 'cashierId', as: 'Cashier' });
    }
  }
  Invoice.init({
    householdId: { type: DataTypes.INTEGER, allowNull: false, field: 'household_id' },
    feePeriodId: { type: DataTypes.INTEGER, allowNull: false, field: 'fee_period_id' },
    totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, field: 'total_amount' },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'unpaid' },

    // Payment Details
    paymentMethod: { type: DataTypes.ENUM('TienMat', 'ChuyenKhoan'), field: 'payment_method' },
    cashierId: { type: DataTypes.INTEGER, field: 'cashier_id' }, // User ID of who collected
    paidDate: { type: DataTypes.DATE, field: 'paid_date' },
    notes: { type: DataTypes.TEXT },
  }, {
    sequelize,
    modelName: 'Invoice',
    tableName: 'invoices',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Invoice;
};