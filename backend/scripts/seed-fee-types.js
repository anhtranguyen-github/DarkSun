/**
 * Seed Script for Fee Types
 * Creates the default mandatory fee types as per v2.0 specification
 */
require('dotenv').config();
const { FeeType, sequelize } = require('../models');

const FEE_TYPES = [
    {
        name: 'Phí vệ sinh',
        unit: 'VND/người/tháng',
        price: 6000,
        description: 'Phí vệ sinh môi trường bắt buộc',
        category: 'mandatory'
    },
    {
        name: 'Phí gửi xe máy',
        unit: 'VND/xe/tháng',
        price: 70000,
        description: 'Phí gửi xe máy tại bãi đỗ chung cư',
        category: 'mandatory'
    },
    {
        name: 'Phí gửi ô tô',
        unit: 'VND/xe/tháng',
        price: 1200000,
        description: 'Phí gửi ô tô tại bãi đỗ chung cư',
        category: 'mandatory'
    },
    {
        name: 'Phí dịch vụ quản lý',
        unit: 'VND/m2/tháng',
        price: 7000,
        description: 'Phí dịch vụ quản lý tòa nhà',
        category: 'mandatory'
    },
    {
        name: 'Đóng góp từ thiện',
        unit: 'VND',
        price: 0,
        description: 'Các đợt quyên góp từ thiện (giá tùy theo đợt)',
        category: 'contribution'
    }
];

const seedFeeTypes = async () => {
    try {
        console.log('🌱 Seeding Fee Types...');

        for (const feeType of FEE_TYPES) {
            const [record, created] = await FeeType.findOrCreate({
                where: { name: feeType.name },
                defaults: feeType
            });

            console.log(`   ${created ? '✅ Created' : '⏭️  Exists'}: ${feeType.name}`);
        }

        console.log('✅ Fee Types seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding fee types:', error);
        process.exit(1);
    }
};

seedFeeTypes();
