require('dotenv').config();
const { Role, sequelize } = require('../models');
const { Op } = require('sequelize');

const cleanRoles = async () => {
    try {
        console.log('🧹 Cleaning up Roles...');

        // Define standard roles to KEEP
        const STANDARD_ROLES = ['admin', 'manager', 'deputy', 'accountant', 'resident'];

        // Find all roles NOT in the standard list
        const rolesToDelete = await Role.findAll({
            where: {
                name: { [Op.notIn]: STANDARD_ROLES }
            }
        });

        if (rolesToDelete.length > 0) {
            console.log(`⚠️ Found ${rolesToDelete.length} invalid roles to delete:`);
            rolesToDelete.forEach(r => console.log(`   - ID: ${r.id} | Name: ${r.name} | Display: ${r.displayName}`));

            // Delete them
            const deletedCount = await Role.destroy({
                where: {
                    name: { [Op.notIn]: STANDARD_ROLES }
                }
            });
            console.log(`🗑️  Deleted ${deletedCount} invalid roles.`);
        } else {
            console.log('✅ No invalid roles found.');
        }

        // List remaining roles
        const remainingRoles = await Role.findAll();
        console.table(remainingRoles.map(r => ({ id: r.id, name: r.name, displayName: r.displayName })));

    } catch (error) {
        console.error('❌ Error cleaning roles:', error);
    } finally {
        await sequelize.close();
    }
};

cleanRoles();
