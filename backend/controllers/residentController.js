const { Resident, Household } = require('../models');
const { Op } = require('sequelize');

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

    // Update Household member count logic could be here (or handled by DB Trigger/Hook)
    // For now, simpler to increment manual or count on retrieval.

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
    // TODO: Verify if Owner? If owner, prevent delete?

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
