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
      // Thêm 'field' để ánh xạ chính xác tới tên cột trong CSDL
      field: 'relationship_with_owner' 
    }
  }, {
    sequelize,
    modelName: 'Resident',
    tableName: 'residents',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Resident;
};