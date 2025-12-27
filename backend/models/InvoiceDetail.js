'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InvoiceDetail extends Model {
    static associate(models) {
      this.belongsTo(models.Invoice, { foreignKey: 'invoiceId' });
      this.belongsTo(models.FeeType, { foreignKey: 'feeTypeId' });
    }
  }
  InvoiceDetail.init({
    invoiceId: { type: DataTypes.INTEGER, allowNull: false, field: 'invoice_id' },
    feeTypeId: { type: DataTypes.INTEGER, allowNull: false, field: 'fee_type_id' },
    quantity: { type: DataTypes.NUMERIC(10, 2), allowNull: false },
    priceAtTime: { type: DataTypes.DECIMAL(12, 2), allowNull: false, field: 'price_at_time' },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  }, {
    sequelize,
    modelName: 'InvoiceDetail',
    tableName: 'invoice_details',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return InvoiceDetail;
};