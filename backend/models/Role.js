'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        through: models.UserRole,
        foreignKey: 'role_id',
        otherKey: 'user_id',
      });

      // Permission association
      this.belongsToMany(models.Permission, {
        through: 'role_permissions',
        foreignKey: 'role_id',
        otherKey: 'permission_id',
      });
    }
  }
  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    displayName: {
      type: DataTypes.STRING,
      field: 'display_name',
      allowNull: true
    },
    description: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    underscored: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
  return Role;
};