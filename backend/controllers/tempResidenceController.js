const { TemporaryResidence, Resident } = require('../models');
const { Op } = require('sequelize');

exports.registerTemporaryResidence = async (req, res) => {
    try {
        const { residentId, type, permitCode, startDate, endDate, address, reason } = req.body;

        if (!residentId || !type || !startDate) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc (Cư dân, Loại hình, Từ ngày).' });
        }

        const resident = await Resident.findByPk(residentId);
        if (!resident) return res.status(404).json({ message: 'Cư dân không tồn tại.' });

        const record = await TemporaryResidence.create({
            residentId, type, permitCode, startDate, endDate, address, reason
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
