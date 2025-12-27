'use strict';
const { Model } = require('sequelize');
const { hashPassword } = require('../utils/passwordUtils');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Role, {
        through: models.UserRole,
        foreignKey: 'user_id', // Dùng tên cột trong DB
        otherKey: 'role_id',
      });
      this.belongsTo(models.Household, { foreignKey: 'household_id' });
    }
  }
  User.init({
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    fullName: { type: DataTypes.STRING, field: 'full_name', allowNull: false },
    email: { type: DataTypes.STRING, unique: true, validate: { isEmail: true } },
    phone_number: { type: DataTypes.STRING },
    avatar_url: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, defaultValue: 'active' },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await hashPassword(user.password);
        }
      },
    },
    householdId: { type: DataTypes.INTEGER, field: 'household_id' },
  });
  return User;
};