// models/Household.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Household extends Model {
    static associate(models) {
      this.hasMany(models.Resident, { foreignKey: 'household_id' });
      this.hasMany(models.Invoice, { foreignKey: 'household_id' });
      this.hasMany(models.Vehicle, { foreignKey: 'household_id' }); // Link to cars/motorbikes
      this.belongsTo(models.Resident, { as: 'Owner', foreignKey: 'owner_id' }); // Strict link to owner
    }
  }
  Household.init({
    householdCode: { type: DataTypes.STRING, field: 'household_code', allowNull: false, unique: true }, // So so ho khau
    ownerId: { type: DataTypes.INTEGER, field: 'owner_id', allowNull: true }, // Link ID chu ho (Nullable for creation)
    count: { type: DataTypes.INTEGER, field: 'member_count', defaultValue: 0 },

    // Address Breakdown
    addressStreet: { type: DataTypes.STRING, field: 'address_street' }, // Duong/Thon
    addressWard: { type: DataTypes.STRING, field: 'address_ward' }, // Phuong/Xa
    addressDistrict: { type: DataTypes.STRING, field: 'address_district' }, // Quan/Huyen

    // Legacy/Composite Address
    address: { type: DataTypes.STRING },

    area: { type: DataTypes.NUMERIC(10, 2) },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'occupied' },
    createdDate: { type: DataTypes.DATE, field: 'created_date' } // Ngay lap
  }, {
    sequelize,
    modelName: 'Household',
    tableName: 'households',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Household;
};