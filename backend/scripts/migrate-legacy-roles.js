require('dotenv').config();
const { sequelize, User, Role } = require('../models');

const LEGACY_MAP = {
    'to_truong': 'manager',
    'to_pho': 'deputy',
    'ke_toan': 'accountant',
    'cu_dan': 'resident'
};

const migrateRoles = async () => {
    const t = await sequelize.transaction();
    try {
        console.log('🔄 Starting Legacy Role Migration...');

        for (const [legacyName, newName] of Object.entries(LEGACY_MAP)) {
            // 1. Find Legacy Role
            const legacyRole = await Role.findOne({ where: { name: legacyName }, transaction: t });
            if (!legacyRole) {
                console.log(`   ⏭️  Legacy role '${legacyName}' not found. Skipping.`);
                continue;
            }

            // 2. Find New Role
            const newRole = await Role.findOne({ where: { name: newName }, transaction: t });
            if (!newRole) {
                console.error(`   ❌ New role '${newName}' not found! Run seed-rbac.js first.`);
                continue; // Cannot migrate if new role missing
            }

            // 3. Find Users with Legacy Role
            const users = await legacyRole.getUsers({ transaction: t });
            if (users.length > 0) {
                console.log(`   📦 Found ${users.length} users with role '${legacyName}'. Migrating to '${newName}'...`);
                for (const user of users) {
                    // Add new role
                    await user.addRole(newRole, { transaction: t });
                    // Remove old role
                    await user.removeRole(legacyRole, { transaction: t });
                    console.log(`      -> User ${user.username} migrated.`);
                }
            } else {
                console.log(`   ✓ No users found with role '${legacyName}'.`);
            }

            // 4. Delete Role Permissions (Clean up join table first usually handled by cascade, but safely delete role)
            // Delete Legacy Role
            await legacyRole.destroy({ transaction: t });
            console.log(`   🗑️  Deleted legacy role '${legacyName}'.\n`);
        }

        await t.commit();
        console.log('✅ Role Migration Clean & Complete.');
        process.exit(0);
    } catch (error) {
        await t.rollback();
        console.error('❌ Migration Failed:', error);
        process.exit(1);
    }
};

migrateRoles();
