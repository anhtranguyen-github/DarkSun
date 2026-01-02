require('dotenv').config();
const db = require('../models');

const sync = async () => {
    try {
        console.log('🔄 Syncing Database Schemes (v2.0)...');
        // 'alter: true' applies changes to existing tables (non-destructive)
        // 'force: true' drops tables (destructive) - Use clear-db.js for that if needed.
        await db.sequelize.sync({ alter: true });
        console.log('✅ Database synced successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to sync database:', error);
        process.exit(1);
    }
};

sync();
