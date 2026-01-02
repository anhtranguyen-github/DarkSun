// models/Resident.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Resident extends Model {
    static associate(models) {
      this.belongsTo(models.Household, { foreignKey: 'household_id' }); // Dùng tên cột trong CSDL
    }
  }
  Resident.init({
    // Các trường đã khớp
    householdId: {
      type: DataTypes.INTEGER,
      field: 'household_id',
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      field: 'full_name',
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      field: 'date_of_birth'
    },
    idCardNumber: {
      type: DataTypes.STRING,
      field: 'id_card_number',
      unique: true
    },
    gender: {
      type: DataTypes.ENUM('Nam', 'Nữ', 'Khác')
    },
    occupation: {
      type: DataTypes.STRING
    },

    // --- SỬA ĐỔI QUAN TRỌNG Ở ĐÂY ---
    relationship: {
      type: DataTypes.STRING,
      field: 'relationship_with_owner'
    },
    // New Fields v2.0
    alias: { type: DataTypes.STRING }, // Bi danh
    birthPlace: { type: DataTypes.STRING, field: 'birth_place' }, // Noi sinh
    nativePlace: { type: DataTypes.STRING, field: 'native_place' }, // Nguyen quan
    ethnicity: { type: DataTypes.STRING }, // Dan toc
    religion: { type: DataTypes.STRING }, // Ton giao
    workplace: { type: DataTypes.STRING }, // Noi lam viec
    idCardDate: { type: DataTypes.DATE, field: 'id_card_date' }, // Ngay cap CCCD
    idCardPlace: { type: DataTypes.STRING, field: 'id_card_place' }, // Noi cap CCCD
    previousResidence: { type: DataTypes.STRING, field: 'previous_residence' }, // Dia chi truoc khi chuyen den
    moveInDate: { type: DataTypes.DATE, field: 'move_in_date' }, // Ngay chuyen den
  }, {
    sequelize,
    modelName: 'Resident',
    tableName: 'residents',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Resident;
};