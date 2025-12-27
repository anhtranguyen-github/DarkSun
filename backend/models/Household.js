// models/Household.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Household extends Model {
    static associate(models) {
      this.hasMany(models.Resident, { foreignKey: 'household_id' });
      this.hasMany(models.Invoice, { foreignKey: 'household_id' });
    }
  }
  Household.init({
    apartmentCode: { type: DataTypes.STRING, field: 'apartment_code', allowNull: false, unique: true },
    area: { type: DataTypes.NUMERIC(10, 2) },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'occupied' },
    address: { type: DataTypes.STRING },
    apartmentType: { type: DataTypes.STRING, field: 'apartment_type' },
    // --- THAY ĐỔI THEO ĐẶC TẢ ---
    ownerName: { type: DataTypes.STRING, field: 'owner_name', allowNull: false }, // Bắt buộc
    memberCount: { type: DataTypes.INTEGER, field: 'member_count', allowNull: false } // Bắt buộc
  }, {
    sequelize,
    modelName: 'Household',
    tableName: 'households',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Household;
};