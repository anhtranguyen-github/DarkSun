const { Household, Resident, Vehicle, Invoice, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const { sanitizeHtml, isValidArea, isValidLength } = require('../utils/validationUtils');

// FIXED: Thêm validation cho diện tích và địa chỉ
const validateHouseholdData = (data) => {
    const { householdCode, area, addressStreet, addressWard, addressDistrict } = data;
    if (!householdCode) return 'Mã hộ khẩu không được để trống.';
    if (area !== undefined && (isNaN(area) || area <= 0)) return 'Diện tích phải là số dương hợp lệ.';
    if (!addressStreet || !addressWard || !addressDistrict) return 'Địa chỉ phải bao gồm đầy đủ số nhà/đường, phường và quận.';
    return null;
};

// GET all households (Optimized for v2.0)
exports.getAllHouseholds = async (req, res) => {
    try {
        const { householdCode, ownerName, address } = req.query;
        const whereClause = {};

        if (householdCode) {
            whereClause.householdCode = { [Op.iLike]: `%${householdCode}%` };
        }
        // Complex query: If ownerName is filtering, we need to include Resident and filter there

        // Address fuzzy search
        if (address) {
            whereClause[Op.or] = [
                { address: { [Op.iLike]: `%${address}%` } },
                { addressStreet: { [Op.iLike]: `%${address}%` } }
            ];
        }

        const households = await Household.findAll({
            where: whereClause,
            include: [
                {
                    model: Resident,
                    as: 'Owner',
                    attributes: ['id', 'fullName', 'dateOfBirth', 'idCardNumber'],
                    where: ownerName ? { fullName: { [Op.iLike]: `%${ownerName}%` } } : undefined
                },
                {
                    model: User,
                    as: 'AssociatedAccounts',
                    attributes: ['id', 'username', 'status']
                }
            ],
            order: [['householdCode', 'ASC']],
        });

        res.status(200).json({ success: true, data: households });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// GET Details
exports.getHouseholdDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const household = await Household.findByPk(id, {
            include: [
                { model: Resident, as: 'Owner' },
                { model: Resident }, // All members
                { model: Vehicle },   // Cars/Motos
                { model: User, as: 'AssociatedAccounts', attributes: ['id', 'username', 'email', 'status'] } // Linked User Accounts
            ]
        });

        if (!household) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy hộ khẩu.' });
        }

        res.status(200).json({ success: true, data: household });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// CREATE Household (Transactional)
exports.createHousehold = async (req, res) => {
    const error = validateHouseholdData(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    const t = await sequelize.transaction();
    try {
        const { householdCode, addressStreet, addressWard, addressDistrict, area, owner } = req.body;

        if (!owner || !owner.fullName || !owner.idCardNumber) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin Chủ Hộ.' });
        }

        const newHousehold = await Household.create({
            householdCode, addressStreet, addressWard, addressDistrict, area,
            address: `${addressStreet}, ${addressWard}, ${addressDistrict}`,
            createdDate: new Date(),
            memberCount: 1
        }, { transaction: t });

        const newOwner = await Resident.create({
            ...owner,
            householdId: newHousehold.id,
            relationship: 'Chủ hộ'
        }, { transaction: t });

        await newHousehold.update({ ownerId: newOwner.id }, { transaction: t });
        await t.commit();

        res.status(201).json({ success: true, message: 'Tạo hộ khẩu mới thành công!', data: { household: newHousehold, owner: newOwner } });
    } catch (error) {
        await t.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ message: 'Mã hộ hoặc CCCD chủ hộ đã tồn tại.' });
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// UPDATE Address/Info
exports.updateHousehold = async (req, res) => {
    try {
        const household = await Household.findByPk(req.params.id);
        if (!household) return res.status(404).json({ message: 'Không tìm thấy hộ khẩu.' });

        // FIXED: Add validation for update too
        if (req.body.area && (isNaN(req.body.area) || req.body.area <= 0)) {
            return res.status(400).json({ message: 'Diện tích phải là số dương.' });
        }

        await household.update(req.body);
        res.status(200).json({ success: true, message: 'Cập nhật thành công!', data: household });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// CHANGE Owner (Optional v2.0 feature)
exports.changeOwner = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { newOwnerId } = req.body;

        const household = await Household.findByPk(id);
        const newOwner = await Resident.findByPk(newOwnerId);

        if (!household || !newOwner) return res.status(404).json({ message: 'Dữ liệu không tồn tại.' });
        if (newOwner.householdId !== household.id) return res.status(400).json({ message: 'Chủ hộ mới phải là thành viên trong hộ.' });

        // FIXED: Reset chủ hộ cũ về 'Thành viên' (Business Logic)
        await Resident.update(
            { relationship: 'Thành viên' },
            { where: { id: household.ownerId }, transaction: t }
        );

        // Set chủ hộ mới
        await household.update({ ownerId: newOwnerId }, { transaction: t });
        await newOwner.update({ relationship: 'Chủ hộ' }, { transaction: t });

        await t.commit();
        res.status(200).json({ success: true, message: 'Thay đổi chủ hộ thành công (Đã cập nhật trạng thái người cũ).' });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// DELETE Household (with cascade check)
exports.deleteHousehold = async (req, res) => {
    try {
        const { id } = req.params;
        const household = await Household.findByPk(id);

        if (!household) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy hộ khẩu.' });
        }

        // FIXED: Cascade delete check - check for residents
        const residentCount = await Resident.count({ where: { householdId: id } });
        if (residentCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Không thể xóa: Hộ khẩu này còn ${residentCount} nhân khẩu. Vui lòng chuyển/xóa nhân khẩu trước.`
            });
        }

        // FIXED: Check for vehicles
        const vehicleCount = await Vehicle.count({ where: { householdId: id } });
        if (vehicleCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Không thể xóa: Hộ khẩu này còn ${vehicleCount} phương tiện đăng ký.`
            });
        }

        // FIXED: Check for unpaid invoices
        if (Invoice) {
            const unpaidInvoiceCount = await Invoice.count({
                where: { householdId: id, status: 'unpaid' }
            });
            if (unpaidInvoiceCount > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Không thể xóa: Hộ khẩu này còn ${unpaidInvoiceCount} hóa đơn chưa thanh toán.`
                });
            }
        }

        await household.destroy();
        res.status(200).json({ success: true, message: 'Xóa hộ khẩu thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};
