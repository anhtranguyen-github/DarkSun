const { User, Role } = require('./models');

async function getCredentials() {
    try {
        const roles = ['Admin', 'Tổ trưởng', 'Tổ phó', 'Kế toán', 'Cư dân'];
        console.log('\n=== DANH SÁCH TÀI KHOẢN ===');
        console.log('| Vai trò      | Username        | Password |');
        console.log('|--------------|-----------------|----------|');

        for (const roleName of roles) {
            const users = await User.findAll({
                include: [{
                    model: Role,
                    where: { name: roleName }
                }],
                limit: 1
            });

            if (users.length > 0) {
                // Note: We can't see the real password since it's hashed, 
                // but for demo purposes we usually set a known one or I will note it.
                // Assuming '123456' or similar dev password if we created them, 
                // but for now I will just list the username.
                console.log(`| ${roleName.padEnd(12)} | ${users[0].username.padEnd(15)} | ???      |`);
            } else {
                console.log(`| ${roleName.padEnd(12)} | (Chưa có)       |          |`);
            }
        }
        console.log('=============================\n');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

getCredentials();
