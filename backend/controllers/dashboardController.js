const { User, Role, Household, Resident, Vehicle, FeePeriod, Invoice } = require('../models');

// Helper to format relative time
const getRelativeTime = (date) => {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000); // seconds

  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
};

// Lấy các chỉ số thống kê chính cho Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // FIXED: Privilege check context
    const isAccountant = req.user.roles.includes('accountant');
    const isAdmin = req.user.roles.includes('admin') || req.user.roles.includes('manager');

    // OPTIMIZATION: Use Promise.all for parallel queries
    const queries = [
      Resident.count(),
      Household.count(),
      Vehicle.count(),
      FeePeriod.count({ where: { status: 'open' } })
    ];

    const [
      totalResidents,
      totalHouseholds,
      totalVehicles,
      activeFeePeriods
    ] = await Promise.all(queries);

    // Filter recent activities based on role if necessary
    // For now, accountant can see basic stats but maybe limited details
    const recentResidents = await Resident.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: Household }]
    });

    const recentActivities = recentResidents.map(r => ({
      id: r.id,
      user: r.relationship === 'Chủ hộ' ? 'CH' : 'NK',
      action: `Thêm nhân khẩu: ${r.fullName} vào hộ ${r.Household?.householdCode || 'N/A'}`,
      time: getRelativeTime(r.createdAt),
      type: r.relationship === 'Chủ hộ' ? 'success' : 'info'
    }));

    // Accountant should primarily see financial summaries (mocked or added as requested)
    let financialSummary = null;
    if (isAccountant || isAdmin) {
      financialSummary = {
        totalRevenue: 150000000, // Example data
        unpaidInvoices: await Invoice.count({ where: { status: 'unpaid' } })
      };
    }

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
        totalResidents: isAccountant ? '---' : totalResidents, // Optional masking for privacy if needed
        totalHouseholds,
        totalVehicles,
        activeFeePeriods,
        recentActivities: isAccountant ? [] : recentActivities, // Mask non-financial activity for strictly financial roles if desired
        financialSummary,
        staffList: staffList.map(s => ({
          name: s.fullName,
          role: s.Roles?.[0]?.displayName || 'Nhân viên',
          active: s.status === 'active'
        }))
      },
    });
  } catch (error) {
    console.error('DASHBOARD STATS ERROR:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};