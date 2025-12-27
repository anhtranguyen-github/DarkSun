require('dotenv').config();
const { User, Role, sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function createDemoUsers() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB...');

        const password = 'password123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const demoAccounts = [
            { role: 'Admin', username: 'demo_admin', fullName: 'Demo Admin' },
            { role: 'Tổ trưởng', username: 'demo_totruong', fullName: 'Demo Tổ Trưởng' },
            { role: 'Tổ phó', username: 'demo_topho', fullName: 'Demo Tổ Phó' },
            { role: 'Kế toán', username: 'demo_ketoan', fullName: 'Demo Kế Toán' },
            { role: 'Cư dân', username: 'demo_cudan', fullName: 'Demo Cư Dân' }
        ];

        console.log('\n=== TẠO TÀI KHOẢN DEMO (Mật khẩu: password123) ===');

        for (const acc of demoAccounts) {
            // 1. Find or create Role
            let [roleObj] = await Role.findOrCreate({ where: { name: acc.role } });

            // 2. Find or create User
            // We use findOne first to avoid duplicate username errors if we re-run
            let user = await User.findOne({ where: { username: acc.username } });

            if (!user) {
                user = await User.create({
                    username: acc.username,
                    password: hashedPassword, // Manually set hashed password to ensure we know it
                    fullName: acc.fullName,
                    status: 'active'
                });
                console.log(`✅ Đã tạo: ${acc.username} (${acc.role})`);
            } else {
                // Reset password just in case
                await user.update({ password: hashedPassword, status: 'active' });
                console.log(`♻️  Đã reset: ${acc.username} (${acc.role})`);
            }

            // 3. Assign Role (check if already has it)
            const hasRole = await user.hasRole(roleObj);
            if (!hasRole) {
                await user.addRole(roleObj);
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
