require('dotenv').config();
const db = require('../models');

const resetDb = async () => {
    try {
        console.log('🗑️  Dropping all tables (v2.0 Clean Slate)...');
        // 'force: true' drops and recreates tables
        await db.sequelize.sync({ force: true });
        console.log('✅ All tables have been dropped and recreated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to reset database:', error);
        process.exit(1);
    }
};

resetDb();
