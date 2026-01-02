const { User, Household, Resident, Vehicle, FeePeriod, Invoice } = require('../models');

// Lấy các chỉ số thống kê chính cho Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalResidents,
      totalHouseholds,
      totalVehicles,
      activeFeePeriods
    ] = await Promise.all([
      Resident.count(),
      Household.count(),
      Vehicle.count(),
      FeePeriod.count({ where: { status: 'open' } })
    ]);

    // Lấy 5 hoạt động gần đây (ví dụ: các cư dân mới được thêm)
    const recentResidents = await Resident.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: Household }]
    });

    const recentActivities = recentResidents.map(r => ({
      id: r.id,
      user: r.relationship === 'Chủ hộ' ? 'CH' : 'NK',
      action: `Thêm nhân khẩu: ${r.fullName} vào hộ ${r.Household?.householdCode || 'N/A'}`,
      time: 'Gần đây',
      type: r.relationship === 'Chủ hộ' ? 'success' : 'info'
    }));

    // Lấy danh sách quản lý viên (nhân viên hệ thống)
    const staffList = await User.findAll({
      limit: 3,
      attributes: ['fullName', 'status'],
      include: [{
        model: Role,
        attributes: ['displayName'],
        through: { attributes: [] }
      }]
    });

    res.status(200).json({
      success: true,
      data: {
        totalResidents,
        totalHouseholds,
        totalVehicles,
        activeFeePeriods,
        recentActivities,
        staffList: staffList.map(s => ({
          name: s.fullName,
          role: s.Roles?.[0]?.displayName || 'Nhân viên',
          active: s.status === 'active'
        }))
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};