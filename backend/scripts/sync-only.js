require('dotenv').config();
const db = require('../models');

const syncOnly = async () => {
    try {
        console.log('🔄 Verifying database schema (Safe Mode)...');
        // 'alter: true' tries to update tables to match model without deleting data
        await db.sequelize.sync({ alter: true });
        console.log('✅ Database schema synchronized.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Sync failed:', error);
        process.exit(1);
    }
};

syncOnly();
