const { Resident, Household } = require('../models');
const { Op } = require('sequelize');
const { sanitizeHtml, isValidName, isValidIdCard, isValidBirthDate, isValidGender, isValidLength } = require('../utils/validationUtils');

// GET all residents with Filters
exports.getAllResidents = async (req, res) => {
    try {
        const { fullName, householdCode, idCardNumber, relationship } = req.query;

        const whereClause = {};
        if (fullName) whereClause.fullName = { [Op.iLike]: `%${fullName}%` };
        if (idCardNumber) whereClause.idCardNumber = { [Op.iLike]: `%${idCardNumber}%` };
        if (relationship) whereClause.relationship = { [Op.iLike]: `%${relationship}%` };

        const queryOptions = {
            where: whereClause,
            include: {
                model: Household,
                attributes: ['householdCode']
            },
            order: [['fullName', 'ASC']]
        };

        if (householdCode) {
            queryOptions.include.where = {
                householdCode: { [Op.iLike]: `%${householdCode}%` }
            };
            queryOptions.include.required = true;
        }

        const residents = await Resident.findAll(queryOptions);
        res.status(200).json({ success: true, data: residents });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// CREATE Resident (Add to existing Household)
exports.createResident = async (req, res) => {
    try {
        const {
            householdId,
            fullName, dateOfBirth, gender,
            alias, birthPlace, nativePlace, ethnicity, religion, workplace,
            idCardNumber, idCardDate, idCardPlace,
            relationship, previousResidence, moveInDate
        } = req.body;

        // FIXED: Enhanced Validation
        if (!isValidName(fullName, 2, 100)) {
            return res.status(400).json({ message: 'Họ tên phải từ 2-100 ký tự, không chứa mã HTML.' });
        }
        if (idCardNumber && !isValidIdCard(idCardNumber)) {
            return res.status(400).json({ message: 'Số CCCD phải là 9 hoặc 12 chữ số.' });
        }

        // FIXED: Birth date validation (not future, not > 150 years old)
        if (!isValidBirthDate(dateOfBirth)) {
            return res.status(400).json({ message: 'Ngày sinh không hợp lệ (không được trong tương lai và không quá 150 tuổi).' });
        }

        // FIXED: Gender validation
        if (!isValidGender(gender)) {
            return res.status(400).json({ message: 'Giới tính phải là: Nam, Nữ hoặc Khác.' });
        }

        // FIXED: Optional field length validation
        if (alias && !isValidLength(alias, 0, 50)) {
            return res.status(400).json({ message: 'Bí danh không được quá 50 ký tự.' });
        }
        if (ethnicity && !isValidLength(ethnicity, 0, 50)) {
            return res.status(400).json({ message: 'Dân tộc không được quá 50 ký tự.' });
        }
        if (religion && !isValidLength(religion, 0, 50)) {
            return res.status(400).json({ message: 'Tôn giáo không được quá 50 ký tự.' });
        }

        if (!householdId || !fullName || !dateOfBirth || !gender) {
            return res.status(400).json({ success: false, message: 'Các trường bắt buộc: Hộ khẩu ID, Họ tên, Ngày sinh, Giới tính.' });
        }

        const householdExists = await Household.findByPk(householdId);
        if (!householdExists) {
            return res.status(404).json({ success: false, message: 'Hộ khẩu không tồn tại.' });
        }

        const newResident = await Resident.create({
            householdId, fullName, dateOfBirth, gender,
            alias, birthPlace, nativePlace, ethnicity, religion, workplace,
            idCardNumber, idCardDate, idCardPlace,
            relationship, previousResidence,
            moveInDate: moveInDate || new Date()
        });

        res.status(201).json({ success: true, message: 'Thêm nhân khẩu thành công!', data: newResident });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ success: false, message: 'Số CCCD đã tồn tại.' });
        }
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// UPDATE Resident
exports.updateResident = async (req, res) => {
    try {
        const { residentId } = req.params;
        const resident = await Resident.findByPk(residentId);
        if (!resident) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy nhân khẩu.' });
        }

        // FIXED: Add validation for update
        if (req.body.fullName && req.body.fullName.length < 2) return res.status(400).json({ message: 'Họ tên không hợp lệ.' });
        if (req.body.idCardNumber && !/^\d{9,12}$/.test(req.body.idCardNumber)) return res.status(400).json({ message: 'Số CCCD phải là 9 hoặc 12 chữ số.' });

        await resident.update(req.body);
        res.status(200).json({ success: true, message: 'Cập nhật thành công!', data: resident });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// DELETE Resident
exports.deleteResident = async (req, res) => {
    try {
        const { residentId } = req.params;
        const resident = await Resident.findByPk(residentId);

        if (!resident) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy nhân khẩu.' });
        }

        // FIXED: Chặn xóa chủ hộ (Business Logic)
        const isOwner = await Household.findOne({ where: { ownerId: resident.id } });
        if (isOwner) {
            return res.status(403).json({
                success: false,
                message: 'Không thể xóa NHÂN KHẨU đang là CHỦ HỘ. Vui lòng thay đổi chủ hộ cho hộ khẩu này trước khi thực hiện xóa.'
            });
        }

        await resident.destroy();
        res.status(200).json({ success: true, message: 'Xóa nhân khẩu thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// GET Residents by Household
exports.getResidentsByHousehold = async (req, res) => {
    try {
        const { householdId } = req.params;
        const residents = await Resident.findAll({
            where: { householdId },
            order: [['fullName', 'ASC']]
        });
        res.status(200).json({ success: true, data: residents });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};
