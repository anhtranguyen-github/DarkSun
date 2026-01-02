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
            type: DataTypes.ENUM('Oto', 'XeMay'), // Car, Motorbike
            allowNull: false,
            defaultValue: 'XeMay'
        },
        name: {
            type: DataTypes.STRING // e.g., "Honda Vision", "Toyota Vios"
        },
        color: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: 'Vehicle',
        tableName: 'vehicles',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
    return Vehicle;
};
