require('dotenv').config();
const { User, sequelize } = require('./models');
const { comparePassword } = require('./utils/passwordUtils');

async function verify() {
    try {
        console.log('--- LOGIN VERIFICATION ---');
        const username = 'admin123';
        const password = 'password123';

        const user = await User.findOne({ where: { username } });
        if (!user) {
            console.error(`User ${username} not found!`);
            process.exit(1);
        }

        console.log(`User found: ${user.username}`);
        console.log(`Stored hash: ${user.password}`);

        const isMatch = await comparePassword(password, user.password);
        if (isMatch) {
            console.log('✅ LOGIN SUCCESS: Password matched!');
        } else {
            console.error('❌ LOGIN FAILED: Password did NOT match.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

verify();
