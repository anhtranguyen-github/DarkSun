require('dotenv').config();
const { User, Role, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

async function createDemoUsers() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB...');

        // 1. Define Core Roles (v2.0)
        const rolesDef = [
            { name: 'admin', displayName: 'Quản Trị Viên' },
            { name: 'manager', displayName: 'Tổ Trưởng' },
            { name: 'deputy', displayName: 'Tổ Phó' },
            { name: 'accountant', displayName: 'Kế Toán' },
            { name: 'resident', displayName: 'Cư Dân' }
        ];

        console.log('\n=== KHỞI TẠO VAI TRÒ (ROLES) ===');
        for (const r of rolesDef) {
            const [role, created] = await Role.findOrCreate({
                where: { name: r.name },
                defaults: { displayName: r.displayName }
            });
            if (!created && role.displayName !== r.displayName) {
                // Update display name if changed
                await role.update({ displayName: r.displayName });
            }
            console.log(`Role: ${r.name} (${r.displayName}) - ${created ? 'New' : 'Exists'}`);
        }

        const password = 'password123';
        // Note: User model has beforeCreate hook that auto-hashes password

        const demoAccounts = [
            { role: 'admin', username: 'admin123', fullName: 'Master Admin' },
            { role: 'admin', username: 'demo_admin', fullName: 'Demo Admin' },
            { role: 'manager', username: 'demo_manager', fullName: 'Demo Tổ Trưởng' },
            { role: 'deputy', username: 'demo_deputy', fullName: 'Demo Tổ Phó' },
            { role: 'accountant', username: 'demo_accountant', fullName: 'Demo Kế Toán' },
            { role: 'resident', username: 'demo_resident', fullName: 'Demo Cư Dân' }
        ];

        console.log('\n=== TẠO TÀI KHOẢN DEMO (Pass: password123) ===');

        for (const acc of demoAccounts) {
            // Find valid role object
            const roleObj = await Role.findOne({ where: { name: acc.role } });
            if (!roleObj) {
                console.error(`❌ Không tìm thấy role "${acc.role}" cho user ${acc.username}`);
                continue;
            }

            // Check if user exists
            let user = await User.findOne({ where: { username: acc.username } });

            if (user) {
                // Update password using build + save to trigger hook
                user.password = password;
                user.status = 'active';
                await user.save();
                console.log(`♻️  Reset user: ${acc.username}`);
            } else {
                // Create user (hook will hash password)
                user = await User.create({
                    username: acc.username,
                    password: password,
                    fullName: acc.fullName,
                    status: 'active'
                });
                console.log(`✅ Tạo user: ${acc.username}`);
            }

            // Assign Role
            const hasRole = await user.hasRole(roleObj);
            if (!hasRole) {
                await user.addRole(roleObj);
                console.log(`   -> Gán quyền: ${roleObj.displayName}`);
            }
        }

        console.log('==================================================');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi:', error);
        process.exit(1);
    }
}

createDemoUsers();
