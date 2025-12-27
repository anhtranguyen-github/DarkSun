const { Household, sequelize } = require('../models');
const { Op } = require('sequelize');
// GET all households
exports.getAllHouseholds = async (req, res) => {
  try {
    // Lấy các tham số lọc từ URL
    const { apartmentCode, ownerName, address, apartmentType } = req.query;

    const whereClause = {};

    if (apartmentCode) {
      whereClause.apartmentCode = { [Op.iLike]: `%${apartmentCode}%` };
    }
    if (ownerName) {
      whereClause.ownerName = { [Op.iLike]: `%${ownerName}%` };
    }
    if (address) {
      whereClause.address = { [Op.iLike]: `%${address}%` };
    }
    if (apartmentType) {
      whereClause.apartmentType = apartmentType;
    }

    const households = await Household.findAll({
      where: whereClause,
      order: [['apartmentCode', 'ASC']],
    });
    res.status(200).json({ success: true, data: households });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// CREATE a new household
exports.createHousehold = async (req, res) => {
  try {
    // Sử dụng các trường mới theo đặc tả
    const { apartmentCode, ownerName, address, memberCount, apartmentType, area, status } = req.body;
    if (!apartmentCode || !ownerName || !address || !memberCount || !apartmentType) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ các trường bắt buộc.' });
    }
    const newHousehold = await Household.create({ apartmentCode, ownerName, address, memberCount, apartmentType, area, status });
    res.status(201).json({ success: true, message: 'Tạo hộ khẩu thành công!', data: newHousehold });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'Mã hộ khẩu đã tồn tại.' });
    }
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// UPDATE a household
exports.updateHousehold = async (req, res) => {
  try {
    const household = await Household.findByPk(req.params.id);
    if (!household) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hộ khẩu.' });
    }
    await household.update(req.body);
    res.status(200).json({ success: true, message: 'Cập nhật hộ khẩu thành công!', data: household });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// DELETE a household
exports.deleteHousehold = async (req, res) => {
  try {
    const household = await Household.findByPk(req.params.id);
    if (!household) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hộ khẩu.' });
    }
    await household.destroy();
    res.status(200).json({ success: true, message: 'Xóa hộ khẩu thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};