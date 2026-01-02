'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RolePermission extends Model {
        static associate(models) {
            // Junction table, no additional associations needed
        }
    }

    RolePermission.init({
        roleId: {
            type: DataTypes.INTEGER,
            field: 'role_id',
            primaryKey: true,
            references: { model: 'roles', key: 'id' }
        },
        permissionId: {
            type: DataTypes.INTEGER,
            field: 'permission_id',
            primaryKey: true,
            references: { model: 'permissions', key: 'id' }
        }
    }, {
        sequelize,
        modelName: 'RolePermission',
        tableName: 'role_permissions',
        timestamps: false
    });

    return RolePermission;
};
