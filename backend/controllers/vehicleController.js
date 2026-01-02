const { Vehicle, Household } = require('../models');

// GET all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        const { householdId, type, licensePlate } = req.query;
        const whereClause = {};

        if (householdId) whereClause.householdId = householdId;
        if (type) whereClause.type = type;
        if (licensePlate) whereClause.licensePlate = { [require('sequelize').Op.iLike]: `%${licensePlate}%` };

        const vehicles = await Vehicle.findAll({
            where: whereClause,
            include: [{
                model: Household,
                attributes: ['householdCode', 'address']
            }],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({ success: true, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// REGISTER new vehicle
exports.registerVehicle = async (req, res) => {
    try {
        const { householdId, licensePlate, type, name, color } = req.body;

        if (!householdId || !licensePlate || !type) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc (Hộ khẩu, Biển số, Loại xe).' });
        }

        const household = await Household.findByPk(householdId);
        if (!household) {
            return res.status(404).json({ success: false, message: 'Hộ khẩu không tồn tại.' });
        }

        const vehicle = await Vehicle.create({ householdId, licensePlate, type, name, color });

        res.status(201).json({ success: true, message: 'Đăng ký xe thành công.', data: vehicle });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ success: false, message: 'Biển số xe đã tồn tại trong hệ thống.' });
        }
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// UPDATE vehicle
exports.updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByPk(id);

        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy xe.' });
        }

        await vehicle.update(req.body);
        res.status(200).json({ success: true, message: 'Cập nhật thành công.', data: vehicle });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// DELETE vehicle
exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByPk(id);

        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy xe.' });
        }

        await vehicle.destroy();
        res.status(200).json({ success: true, message: 'Xóa xe thành công.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// GET vehicles by household
exports.getVehiclesByHousehold = async (req, res) => {
    try {
        const { householdId } = req.params;
        const vehicles = await Vehicle.findAll({
            where: { householdId },
            order: [['type', 'ASC']]
        });
        res.status(200).json({ success: true, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};
