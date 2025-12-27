// THAY ĐỔI Ở ĐÂY: Import các model cần thiết
const { User, Household, Resident } = require('../models');

// Lấy các chỉ số thống kê chính cho Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const [residentCount, householdCount] = await Promise.all([
      Resident.count(), // Đếm tổng số nhân khẩu
      Household.count() // Đếm tổng số hộ khẩu
    ]);

    const recentActivities = [
      { id: 1, text: 'Kế toán đã tạo đợt thu phí tháng 6/2025.', time: '1 giờ trước' },
      { id: 2, text: 'Tổ trưởng đã thêm hộ khẩu mới: A-1205.', time: '3 giờ trước' },
    ];

    res.status(200).json({
      success: true,
      data: {
        residentCount,
        householdCount,
        recentActivities,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};