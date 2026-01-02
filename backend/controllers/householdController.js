const { Household, Resident, Vehicle, sequelize } = require('../models');
const { Op } = require('sequelize');

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
        { model: Vehicle }   // Cars/Motos
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
  const t = await sequelize.transaction();
  try {
    // Expect: householdCode, address details, AND owner details
    const {
      householdCode,
      addressStreet, addressWard, addressDistrict,
      area,
      owner // Object: { fullName, idCardNumber, dob, gender, ... }
    } = req.body;

    if (!householdCode || !owner || !owner.fullName || !owner.idCardNumber) {
      return res.status(400).json({ message: 'Vui lòng cung cấp Mã Hộ và thông tin Chủ Hộ cơ bản.' });
    }

    // 1. Create Household (OwnerId = null initially)
    const newHousehold = await Household.create({
      householdCode,
      addressStreet,
      addressWard,
      addressDistrict,
      area,
      address: `${addressStreet}, ${addressWard}, ${addressDistrict}`, // Composite
      createdDate: new Date(),
      memberCount: 1 // Starts with owner
    }, { transaction: t });

    // 2. Create Resident (The Owner) linked to this Household
    const newOwner = await Resident.create({
      ...owner, // Spread basics: fullName, dateOfBirth, gender, etc.
      householdId: newHousehold.id,
      relationship: 'Chủ hộ'
    }, { transaction: t });

    // 3. Update Household to link Owner
    await newHousehold.update({ ownerId: newOwner.id }, { transaction: t });

    await t.commit();

    res.status(201).json({
      success: true,
      message: 'Tạo hộ khẩu mới thành công!',
      data: { household: newHousehold, owner: newOwner }
    });

  } catch (error) {
    await t.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      // Check if it's Household Code or Owner ID Card
      if (error.fields.household_code) return res.status(409).json({ message: 'Mã hộ khẩu đã tồn tại.' });
      if (error.fields.id_card_number) return res.status(409).json({ message: 'Số CCCD/CMND chủ hộ đã tồn tại.' });
    }
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// UPDATE Address/Info
exports.updateHousehold = async (req, res) => {
  try {
    const household = await Household.findByPk(req.params.id);
    if (!household) return res.status(404).json({ message: 'Không tìm thấy hộ khẩu.' });

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

    if (!household || !newOwner) {
      return res.status(404).json({ message: 'Dữ liệu không tồn tại.' });
    }

    if (newOwner.householdId !== household.id) {
      return res.status(400).json({ message: 'Chủ hộ mới phải là thành viên trong hộ.' });
    }

    // Update Relationship Strings?
    // Basic: Just update pointer
    await household.update({ ownerId: newOwnerId }, { transaction: t });

    // Ensure resident says 'Chu ho'
    await newOwner.update({ relationship: 'Chủ hộ' }, { transaction: t });

    // Optional: Downgrade old owner to 'Thanh vien'?

    await t.commit();
    res.status(200).json({ success: true, message: 'Thay đổi chủ hộ thành công.' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Lỗi server' });
  }
};