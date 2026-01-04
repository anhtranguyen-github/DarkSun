require('dotenv').config();
const {
    sequelize,
    Household,
    Resident,
    Vehicle,
    FeeType,
    FeePeriod,
    PeriodFee,
    Role,
    User
} = require('../models');

async function seedData() {
    try {
        await sequelize.authenticate();
        console.log('🌱 Starting comprehensive data seeding (Clean-then-Seed)...');

        // 1. Clean up existing data (Safe order due to FKs)
        console.log('🧹 Cleaning existing record-level data...');
        // We don't truncate Roles/Permission/Users (handled by other scripts)
        // But we clear operational data to ensure fresh start
        await Vehicle.destroy({ where: {}, truncate: { cascade: true } });
        await Resident.destroy({ where: {}, truncate: { cascade: true } });
        await Household.destroy({ where: {}, truncate: { cascade: true } });
        await PeriodFee.destroy({ where: {}, truncate: { cascade: true } });
        await FeePeriod.destroy({ where: {}, truncate: { cascade: true } });

        // 2. Create 8 Households
        const householdsData = [
            { householdCode: 'HK-101', addressStreet: 'P.101, Tòa S1', area: 75.5 },
            { householdCode: 'HK-102', addressStreet: 'P.102, Tòa S1', area: 60.0 },
            { householdCode: 'HK-103', addressStreet: 'P.103, Tòa S1', area: 85.0 },
            { householdCode: 'HK-201', addressStreet: 'P.201, Tòa S2', area: 110.2 },
            { householdCode: 'HK-202', addressStreet: 'P.202, Tòa S2', area: 120.5 },
            { householdCode: 'HK-305', addressStreet: 'P.305, Tòa S1', area: 45.0 },
            { householdCode: 'HK-401', addressStreet: 'P.401, Tòa S2', area: 90.5 },
            { householdCode: 'HK-402', addressStreet: 'P.402, Tòa S2', area: 95.0 }
        ];

        console.log('🏠 Seeding Households...');
        const households = [];
        for (const hData of householdsData) {
            const h = await Household.create(hData);
            households.push(h);
        }

        // 3. Create Residents (Owners and members)
        console.log('👥 Seeding Residents...');
        const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi'];
        const middleNames = ['Văn', 'Thị', 'Minh', 'Thanh', 'Hải', 'Xuân', 'Gia'];
        const lastNames = ['An', 'Bình', 'Chinh', 'Đức', 'Em', 'Giang', 'Hùng', 'Khang'];

        for (let i = 0; i < households.length; i++) {
            const h = households[i];

            // Generate unique owner
            const owner = await Resident.create({
                householdId: h.id,
                fullName: `${firstNames[i]} ${middleNames[i % middleNames.length]} ${lastNames[i]}`,
                dateOfBirth: `19${70 + i}-05-15`,
                gender: i % 2 === 0 ? 'Nam' : 'Nữ',
                idCardNumber: `00120000${1000 + i}`,
                relationship: 'Chủ hộ',
                occupation: i % 2 === 0 ? 'Kỹ sư' : 'Kinh doanh',
                status: 'active'
            });

            // Set as owner
            await h.update({ ownerId: owner.id });

            // Create 1-2 members
            await Resident.create({
                householdId: h.id,
                fullName: `${firstNames[i]} ${middleNames[(i + 1) % middleNames.length]} ${lastNames[(i + 1) % lastNames.length]}`,
                dateOfBirth: `20${10 + i}-10-20`,
                gender: i % 3 === 0 ? 'Nữ' : 'Nam',
                idCardNumber: `00120100${2000 + i}`,
                relationship: i % 2 === 0 ? 'Con' : 'Vợ',
                status: 'active'
            });
        }

        // 4. Create Vehicles
        console.log('🚗 Seeding Vehicles...');
        const vehicles = [
            { type: 'Oto', name: 'Toyota Camry', color: 'Black' },
            { type: 'XeMay', name: 'Honda SH', color: 'White' },
            { type: 'XeMay', name: 'Yamaha Exciter', color: 'Blue' },
            { type: 'Oto', name: 'Hyundai Santafe', color: 'Silver' },
            { type: 'XeMay', name: 'Honda Vision', color: 'Red' }
        ];

        for (let i = 0; i < vehicles.length; i++) {
            await Vehicle.create({
                householdId: households[i % households.length].id,
                licensePlate: `${29 + i}A-${10000 + i}`,
                type: vehicles[i].type,
                name: vehicles[i].name,
                color: vehicles[i].color
            });
        }

        // 5. Create Fee Periods
        console.log('💰 Seeding Fee Periods...');
        const feeTypes = await FeeType.findAll();

        const periods = [
            { name: 'Kỳ phí Tháng 12/2025', startDate: '2025-12-01', endDate: '2025-12-31', status: 'closed', type: 'mandatory' },
            { name: 'Kỳ phí Tháng 01/2026', startDate: '2026-01-01', endDate: '2026-01-31', status: 'open', type: 'mandatory' },
            { name: 'Quỹ từ thiện Tết 2026', startDate: '2026-01-10', endDate: '2026-02-10', status: 'open', type: 'contribution' }
        ];

        for (const pData of periods) {
            const period = await FeePeriod.create(pData);

            // Link all mandatory fees
            // Link fees based on period type
            for (const ft of feeTypes) {
                // If Period is Mandatory, add Mandatory Fees
                if (period.type === 'mandatory' && ft.category === 'mandatory') {
                    await PeriodFee.create({
                        feePeriodId: period.id,
                        feeTypeId: ft.id,
                        amount: ft.price,
                        type: 'Bắt buộc'
                    });
                }
                // If Period is Contribution, add Contribution Fees
                else if (period.type === 'contribution' && ft.category === 'contribution') {
                    await PeriodFee.create({
                        feePeriodId: period.id,
                        feeTypeId: ft.id,
                        amount: ft.price || 0, // Contribution often 0 initially?
                        type: 'Đóng góp',
                        description: 'Ủng hộ tự nguyện'
                    });
                }
            }
        }

        // 6. Link Demo Resident to Household 1
        console.log('🔗 Linking Demo Resident...');
        const demoResUser = await User.findOne({ where: { username: 'demo_resident' } });
        if (demoResUser && households.length > 0) {
            await demoResUser.update({ householdId: households[0].id });
            console.log(`   -> demo_resident linked to ${households[0].householdCode}`);
        }

        console.log('✅ Full data seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedData();
