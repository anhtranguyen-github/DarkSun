require('dotenv').config();
const { Household, Resident, User, Vehicle, Invoice, FeeType, Role, FeePeriod, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

// --- DATA DICTIONARIES ---
const HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const DEM_NAM = ['Văn', 'Đức', 'Minh', 'Hữu', 'Quốc', 'Thành', 'Gia', 'Xuân', 'Thanh', 'Tuấn'];
const DEM_NU = ['Thị', 'Mỹ', 'Ngọc', 'Thu', 'Thanh', 'Hồng', 'Phương', 'Bích', 'Kim', 'Diệu'];
const TEN_NAM = ['An', 'Bình', 'Cường', 'Dũng', 'Giang', 'Hải', 'Hiếu', 'Hùng', 'Huy', 'Khánh', 'Long', 'Minh', 'Nam', 'Phúc', 'Quân', 'Quang', 'Sơn', 'Thịnh', 'Trí', 'Tú', 'Tuấn', 'Tùng', 'Việt'];
const TEN_NU = ['Dung', 'Hà', 'Hòa', 'Lan', 'Linh', 'Mai', 'Nga', 'Nhi', 'Nhung', 'Oanh', 'Quỳnh', 'Thảo', 'Trang', 'Uyên', 'Vân', 'Vy', 'Xuân', 'Yên', 'Tâm', 'Thủy', 'Hương'];

const BLOCKS = ['S1', 'S2', 'S3'];
const FLOORS = 12; // 12 floors
const APTS_PER_FLOOR = 8; // 8 apartments per floor

// --- HELPERS ---
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomPhone = () => `0${randomInt(3, 9)}${randomInt(10000000, 99999999)}`;
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const generateName = (gender) => {
    const ho = randomItem(HO);
    if (gender === 'Nam') {
        const dem = randomItem(DEM_NAM);
        const ten = randomItem(TEN_NAM);
        return `${ho} ${dem} ${ten}`;
    } else {
        const dem = randomItem(DEM_NU);
        const ten = randomItem(TEN_NU);
        return `${ho} ${dem} ${ten}`;
    }
};

const MAIN_FEE_TYPES = {
    SERVICE: 'Phí dịch vụ quản lý',
    BIKE: 'Phí gửi xe máy',
    CAR: 'Phí gửi ô tô',
    WATER: 'Tiền nước' // Assuming this exists or we create flexible invoices
};

async function seedFullData() {
    const t = await sequelize.transaction();
    try {
        console.log('🌱 Starting Full Data Seeding...');

        // 0. Ensure Fee Types exist (Run separate script usually, but verify here if needed)
        // We assume seed-fee-types.js ran first.

        const residentRole = await Role.findOne({ where: { name: 'resident' } });

        // 0.1 Create Fee Periods (Jan, Feb, Mar 2025)
        console.log('🗓️  Creating Fee Periods...');
        const feePeriodsMap = {};
        for (let m = 1; m <= 3; m++) {
            const startDate = new Date(2025, m - 1, 1);
            const endDate = new Date(2025, m, 0);

            // Check if exists/create
            const [fp] = await FeePeriod.findOrCreate({
                where: { name: `Đợt thu phí tháng ${m}/2025` },
                defaults: {
                    startDate: startDate,
                    endDate: endDate,
                    status: 'closed',
                    type: 'mandatory',
                    description: `Thu phí dịch vụ tháng ${m}`
                },
                transaction: t
            });
            feePeriodsMap[m] = fp.id;
        }

        // 1. Generate Households
        console.log('🏠 Generating Households...');
        const householdsToCreate = [];

        for (const block of BLOCKS) {
            for (let floor = 1; floor <= FLOORS; floor++) {
                for (let unit = 1; unit <= APTS_PER_FLOOR; unit++) {
                    const floorStr = floor.toString().padStart(floor > 9 ? 0 : 2, '0'); // Actually keep as number or P01
                    // HK Code: S1-0101 (Block S1, Floor 01, Unit 01)
                    // Simplified: S101, S102... S11202
                    const floorDisplay = floor;
                    const unitDisplay = unit.toString().padStart(2, '0');
                    const houseCode = `${block}${floor}${unitDisplay}`; // Ex: S1101, S11208

                    const area = randomItem([55, 64, 72, 85, 96, 110]);

                    householdsToCreate.push({
                        householdCode: houseCode,
                        addressStreet: `P${floor}${unitDisplay}, Tòa ${block}, Chung cư BlueMoon`,
                        addressWard: 'Phường Tân Phong',
                        addressDistrict: 'Quận 7',
                        address: `P${floor}${unitDisplay}, Tòa ${block}, Chung cư BlueMoon, Phường Tân Phong, Quận 7`,
                        area: area,
                        memberCount: 0, // Will update
                        status: 'occupied',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }
            }
        }

        // Limit to ~50 households for speed, or user wanted "many"? 
        // 3 Blocks * 12 Floors * 8 Units = 288 Households. That's good.
        // Let's create ALL of them.

        const createdHouseholds = await Household.bulkCreate(householdsToCreate, { transaction: t, returning: true });
        console.log(`   ✅ Created ${createdHouseholds.length} apartments.`);

        // 2. Residents & Users
        console.log('👨‍👩‍👧‍👦 Populating Residents & Users...');

        const residentsToCreate = [];
        const usersToCreate = [];
        const vehiclesToCreate = [];
        const invoicesToCreate = [];

        // Fetch FeeTypes to map prices
        const feeService = await FeeType.findOne({ where: { name: 'Phí dịch vụ quản lý' } });
        const feeBike = await FeeType.findOne({ where: { name: 'Phí gửi xe máy' } });
        const feeCar = await FeeType.findOne({ where: { name: 'Phí gửi ô tô' } });

        for (const hk of createdHouseholds) {
            // Chance to be empty? (10%)
            if (Math.random() < 0.1) {
                hk.status = 'vacant';
                await hk.save({ transaction: t });
                continue;
            }

            // Family structure: 1-5 members
            const memberCount = randomInt(1, 4);
            let ownerId = null;

            // Generate Members
            for (let i = 0; i < memberCount; i++) {
                const isHead = (i === 0);
                const gender = i === 0 ? randomItem(['Nam', 'Nam', 'Nữ']) : randomItem(['Nam', 'Nữ']); // Head usually male bias in VN data but mix it
                const name = generateName(gender);

                // Age logic
                let birthYear;
                if (isHead) birthYear = randomInt(1960, 1995);
                else birthYear = randomInt(1996, 2020); // Children or younger spouse

                const dob = new Date(birthYear, randomInt(0, 11), randomInt(1, 28));

                residentsToCreate.push({
                    fullName: name,
                    dateOfBirth: dob,
                    gender: gender,
                    identityCardNumber: isHead ? randomInt(100000000000, 999999999999).toString() : null, // Only head needs ID often
                    phoneNumber: isHead ? randomPhone() : null,
                    householdId: hk.id,
                    relationship: isHead ? 'Chủ hộ' : randomItem(['Vợ', 'Chồng', 'Con', 'Con', 'Bố', 'Mẹ']),
                    status: 'permanent',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    temp_is_head: isHead // Marker for logical proceesing later
                });

                // User Account for Head
                if (isHead) {
                    const username = hk.householdCode.toLowerCase(); // ex: s1101
                    const passwordHash = await bcrypt.hash('123456', 10);

                    usersToCreate.push({
                        username: username,
                        password: passwordHash, // 123456
                        fullName: name,
                        email: `${username}@bluemoon.vn`,
                        status: 'active',
                        householdId: hk.id,
                        roleId: residentRole ? residentRole.id : null,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }
            }

            // Update HK Member Count
            hk.memberCount = memberCount;
            await hk.save({ transaction: t });

            // Vehicles
            const bikeCount = randomInt(0, 2);
            for (let b = 0; b < bikeCount; b++) {
                vehiclesToCreate.push({
                    licensePlate: `59-${String.fromCharCode(65 + randomInt(0, 25))}${randomInt(1, 9)} ${randomInt(1000, 9999)}`,
                    type: 'XeMay',
                    ownerName: 'Chủ hộ', // Simplified
                    householdId: hk.id,
                    status: 'active',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
            if (Math.random() > 0.7) { // 30% have car
                vehiclesToCreate.push({
                    licensePlate: `51A-${randomInt(10000, 99999)}`,
                    type: 'Oto',
                    ownerName: 'Chủ hộ',
                    householdId: hk.id,
                    status: 'active',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }

            // Invoices (Last 3 months)
            if (feeService) {
                for (let m = 1; m <= 3; m++) {
                    const amount = (hk.area * (feeService.price || 7000)) + (bikeCount * (feeBike?.price || 70000));
                    const isPaid = Math.random() > 0.3;

                    invoicesToCreate.push({
                        householdId: hk.id,
                        feePeriodId: feePeriodsMap[m],
                        totalAmount: amount,
                        status: isPaid ? 'paid' : 'unpaid',
                        paidDate: isPaid ? new Date(2025, m - 1, randomInt(5, 25)) : null,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }
            }
        }

        // Batch Insert Residents
        console.log(`   ... Inserting ${residentsToCreate.length} residents...`);
        const createdResidents = await Resident.bulkCreate(residentsToCreate, { transaction: t, returning: true });

        // Update OwnerID for Households
        // We need to map back residents to households to set OwnerId
        // This is tricky with bulkCreate returning arrays.
        // Slow but safe used loop update or map.
        // Actually, we marked `temp_is_head`.

        // Let's just create User accounts using bulkCreate too.
        console.log(`   ... Creating ${usersToCreate.length} user accounts...`);
        const createdUsers = await User.bulkCreate(usersToCreate, { transaction: t });

        // Manual Association Logic (Skip for speed/complexity, but OwnerID on Household is important)
        for (const res of createdResidents) {
            if (res.relationship === 'Chủ hộ') {
                await Household.update({ ownerId: res.id }, {
                    where: { id: res.householdId },
                    transaction: t
                });
            }
        }

        // Role Association for Users
        // bulkCreate doesn't do associations.
        // We manually insert into UserRoles table? Or verify residentRole exists.
        if (residentRole) {
            // We can't use bulk addRole easily.
            // We'll iterate users.
            for (const u of createdUsers) {
                await u.addRole(residentRole, { transaction: t });
            }
        }

        console.log(`   ✅ Created ${vehiclesToCreate.length} vehicles.`);
        await Vehicle.bulkCreate(vehiclesToCreate, { transaction: t });

        console.log(`   ✅ Created ${invoicesToCreate.length} invoices.`);
        await Invoice.bulkCreate(invoicesToCreate, { transaction: t });

        await t.commit();
        console.log('🎉 Full Data Seeding Complete!');

    } catch (error) {
        await t.rollback();
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
}

seedFullData().then(() => process.exit(0));
