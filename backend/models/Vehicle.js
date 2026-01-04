'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Vehicle extends Model {
        static associate(models) {
            this.belongsTo(models.Household, { foreignKey: 'household_id' });
        }
    }
    Vehicle.init({
        householdId: {
            type: DataTypes.INTEGER,
            field: 'household_id',
            allowNull: false
        },
        licensePlate: {
            type: DataTypes.STRING,
            field: 'license_plate',
            unique: true,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('Oto', 'XeMay', 'XeDapDien'), // Car, Motorbike, E-bike
            allowNull: false,
            defaultValue: 'XeMay'
        },
        name: {
            type: DataTypes.STRING // e.g., "Honda Vision", "Toyota Vios"
        },
        color: {
            type: DataTypes.STRING
        },
        createdAt: { type: DataTypes.DATE, field: 'created_at' },
        updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
    }, {
        sequelize,
        modelName: 'Vehicle',
        tableName: 'vehicles',
        underscored: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });
    return Vehicle;
};
