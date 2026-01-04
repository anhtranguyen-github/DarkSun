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
    // Check roles
    const userRoles = req.user.roles || [];
    const isAccountant = userRoles.includes('accountant');
    const isManager = userRoles.includes('manager');
    const isAdmin = userRoles.includes('admin');
    const isLanhDao = isAdmin || isManager || userRoles.includes('deputy');
    const isResident = userRoles.includes('resident') && !isLanhDao && !isAccountant;

    // Nếu là cư dân thường (không kiêm nhiệm quản lý), trả về thông tin hạn chế hoặc dashboard cá nhân
    if (isResident) {
      // Lấy thông tin hộ khẩu của user này để hiển thị dashboard cá nhân
      const user = await User.findOne({
        where: { id: req.user.id },
        include: [
          {
            model: Household,
            include: [{ model: Vehicle }, { model: Resident }]
          }
        ]
      });

      const myHousehold = user?.Household;

      return res.status(200).json({
        success: true,
        data: {
          totalResidents: myHousehold?.Residents?.length || 0,
          totalHouseholds: 1, // Hộ gia đình của mình
          totalVehicles: myHousehold?.Vehicles?.length || 0,
          activeFeePeriods: 0, // Không cần hiển thị cho cư dân ở dashboard chính
          financialSummary: null,
          // Custom message for Resident Dashboard
          welcomeMessage: `Chào mừng cư dân ${user?.fullName || ''}!`
        }
      });
    }

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

    // Accountant sees financial summaries
    let financialSummary = null;
    if (isAccountant || isLanhDao) {
      // Mock data or real calculation
      const paidInvoices = await Invoice.sum('totalAmount', { where: { status: 'paid' } }) || 0;
      const unpaidCount = await Invoice.count({ where: { status: 'unpaid' } });

      financialSummary = {
        totalRevenue: paidInvoices,
        unpaidInvoices: unpaidCount
      };
    }

    res.status(200).json({
      success: true,
      data: {
        totalResidents: isAccountant ? '---' : totalResidents, // Optional masking for privacy if needed
        totalHouseholds,
        totalVehicles,
        activeFeePeriods,
        financialSummary
      },
    });
  } catch (error) {
    console.error('DASHBOARD STATS ERROR:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};