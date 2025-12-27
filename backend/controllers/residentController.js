const { Resident, Household, sequelize } = require('../models');
const { Op } = require('sequelize');
// GET: Lấy tất cả nhân khẩu, bao gồm cả thông tin hộ khẩu họ thuộc về
// controllers/residentController.js

exports.getAllResidents = async (req, res) => {
  try {
    const { fullName, householdCode, idCardNumber, relationship } = req.query;

    const whereClause = {};
    
    if (fullName) whereClause.fullName = { [Op.iLike]: `%${fullName}%` };
    if (idCardNumber) whereClause.idCardNumber = { [Op.iLike]: `%${idCardNumber}%` };
    if (relationship) whereClause.relationship = { [Op.iLike]: `%${relationship}%` };

    // Xây dựng các tùy chọn cho truy vấn
    const queryOptions = {
      where: whereClause,
      include: {
        model: Household,
        attributes: ['apartmentCode']
      },
      order: [['fullName', 'ASC']]
    };

    // CHỈ THÊM ĐIỀU KIỆN LỌC TRÊN BẢNG HOUSEHOLD NẾU CÓ householdCode
    if (householdCode) {
      queryOptions.include.where = {
        apartmentCode: { [Op.iLike]: `%${householdCode}%` }
      };
      // Bắt buộc phải có kết quả join thành công
      queryOptions.include.required = true;
    }

    const residents = await Resident.findAll(queryOptions);

    res.status(200).json({ success: true, data: residents });
  } catch (error) {
    console.error("LỖI KHI TRUY VẤN NHÂN KHẨU:", error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// POST: Tạo một nhân khẩu mới (cần cung cấp householdId trong body)
exports.createResident = async (req, res) => {
  try {
    // householdId bây giờ sẽ được gửi trong body của request
    const { householdId, fullName, dateOfBirth, gender, idCardNumber, relationship, occupation } = req.body;

    if (!householdId || !fullName || !dateOfBirth || !gender) {
      return res.status(400).json({ success: false, message: 'Hộ khẩu, Họ tên, Ngày sinh và Giới tính là bắt buộc.' });
    }

    // Kiểm tra xem hộ khẩu có tồn tại không
    const householdExists = await Household.findByPk(householdId);
    if (!householdExists) {
      return res.status(404).json({ success: false, message: 'Hộ khẩu được chọn không tồn tại.' });
    }

    const newResident = await Resident.create(req.body);
    res.status(201).json({ success: true, message: 'Thêm nhân khẩu thành công!', data: newResident });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'Số CCCD đã tồn tại.' });
    }
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// PUT: Cập nhật thông tin một nhân khẩu
exports.updateResident = async (req, res) => {
  try {
    const { residentId } = req.params;
    const resident = await Resident.findByPk(residentId);
    if (!resident) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân khẩu.' });
    }
    await resident.update(req.body);
    res.status(200).json({ success: true, message: 'Cập nhật nhân khẩu thành công!', data: resident });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// DELETE: Xóa một nhân khẩu
exports.deleteResident = async (req, res) => {
  try {
    const { residentId } = req.params;
    const resident = await Resident.findByPk(residentId);
    if (!resident) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân khẩu.' });
    }
    await resident.destroy();
    res.status(200).json({ success: true, message: 'Xóa nhân khẩu thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// HÀM ĐỂ LẤY NHÂN KHẨU CỦA MỘT HỘ
exports.getResidentsByHousehold = async (req, res) => {
  try {
    const { householdId } = req.params;
    const residents = await Resident.findAll({
      where: { household_id: householdId },
      order: [['fullName', 'ASC']]
    });
    res.status(200).json({ success: true, data: residents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

