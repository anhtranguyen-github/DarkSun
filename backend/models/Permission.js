'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Permission extends Model {
        static associate(models) {
            this.belongsToMany(models.Role, {
                through: models.RolePermission,
                foreignKey: 'permission_id',
                otherKey: 'role_id'
            });
        }
    }

    Permission.init({
        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        groupName: {
            type: DataTypes.STRING(50),
            field: 'group_name'
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        modelName: 'Permission',
        tableName: 'permissions',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return Permission;
};
