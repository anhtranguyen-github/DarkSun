'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TemporaryResidence extends Model {
        static associate(models) {
            this.belongsTo(models.Resident, { foreignKey: 'resident_id' });
        }
    }
    TemporaryResidence.init({
        residentId: {
            type: DataTypes.INTEGER,
            field: 'resident_id',
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('TamTru', 'TamVang'), // Temporary Residence, Temporary Absence
            allowNull: false,
            defaultValue: 'TamTru'
        },
        permitCode: {
            type: DataTypes.STRING,
            field: 'permit_code',
            unique: true // Code for the paper/permit
        },
        startDate: {
            type: DataTypes.DATE,
            field: 'start_date',
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            field: 'end_date'
        },
        address: {
            type: DataTypes.STRING, // Address linked to the permit (where moving to/from)
            allowNull: true
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        createdAt: { type: DataTypes.DATE, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
    }, {
        sequelize,
        modelName: 'TemporaryResidence',
        tableName: 'temporary_residences',
        underscored: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return TemporaryResidence;
};
