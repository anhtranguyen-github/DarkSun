const { TemporaryResidence, Resident } = require('../models');
const { Op } = require('sequelize');
const { sanitizeHtml, isValidTempResidenceType, isDateRangeValid, isValidLength, VALID_TEMP_RESIDENCE_TYPES } = require('../utils/validationUtils');

exports.registerTemporaryResidence = async (req, res) => {
    try {
        const { residentId, type, permitCode, startDate, endDate, address, reason } = req.body;

        // FIXED: Enhanced Validation
        if (!residentId || !type || !startDate) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc (Cư dân, Loại hình, Từ ngày).' });
        }

        // FIXED: Type enum validation
        if (!isValidTempResidenceType(type)) {
            return res.status(400).json({ success: false, message: `Loại hình phải là: ${VALID_TEMP_RESIDENCE_TYPES.join(', ')}.` });
        }

        // FIXED: Date range validation
        if (!isDateRangeValid(startDate, endDate)) {
            return res.status(400).json({ success: false, message: 'Ngày kết thúc không được trước ngày bắt đầu.' });
        }

        if (endDate && new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({ success: false, message: 'Ngày kết thúc không được trước ngày bắt đầu.' });
        }

        if (!address || address.trim().length < 5) {
            return res.status(400).json({ success: false, message: 'Địa chỉ tạm trú/tạm vắng không được để trống và phải chi tiết.' });
        }

        if (reason && reason.length > 500) {
            return res.status(400).json({ success: false, message: 'Lý do quá dài (Tối đa 500 ký tự).' });
        }

        const resident = await Resident.findByPk(residentId);
        if (!resident) return res.status(404).json({ message: 'Cư dân không tồn tại.' });

        // Sanitization for codes
        const sanitizedPermitCode = permitCode ? permitCode.trim().replace(/[^a-zA-Z0-9-]/g, '') : null;

        const record = await TemporaryResidence.create({
            residentId,
            type,
            permitCode: sanitizedPermitCode,
            startDate,
            endDate,
            address: address.trim(),
            reason: reason ? reason.trim() : null
        });

        res.status(201).json({ success: true, message: 'Đăng ký thành công.', data: record });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'Mã giấy phép đã tồn tại.' });
        }
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

exports.getTemporaryResidences = async (req, res) => {
    try {
        const { type, residentName } = req.query;
        const whereClause = {};

        // FIXED: Role-based filtering (Optional - if we want residents to only see theirs)
        // If req.user.roles includes 'cu_dan', we could limit residentId to theirs
        // But dashboard usually for staff.

        if (type) whereClause.type = type;

        const records = await TemporaryResidence.findAll({
            where: whereClause,
            include: [{
                model: Resident,
                attributes: ['fullName', 'dateOfBirth', 'idCardNumber'],
                where: residentName ? { fullName: { [Op.iLike]: `%${residentName}%` } } : undefined
            }],
            order: [['startDate', 'DESC']]
        });

        res.status(200).json({ success: true, data: records });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};
