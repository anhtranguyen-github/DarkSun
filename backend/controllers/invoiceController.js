// backend/controllers/invoiceController.js
const invoiceService = require('../services/invoiceService');

exports.generateInvoices = async (req, res) => {
  try {
    const { feePeriodId } = req.params;
    const result = await invoiceService.generateInvoicesForPeriod(feePeriodId);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Lỗi server khi tạo hóa đơn.' });
  }
};

const { Invoice, InvoiceDetail, FeeType, FeePeriod, User } = require('../models');

// GET: Lấy tất cả hóa đơn của hộ khẩu mà người dùng đang đăng nhập thuộc về
exports.getMyInvoices = async (req, res) => {
  try {
    // req.user.id được lấy từ token (middleware 'protect')
    const user = await User.findByPk(req.user.id);
    if (!user || !user.householdId) {
      // Return empty array instead of 404 for users without household (like Admin)
      return res.status(200).json({ success: true, data: [], message: 'Bạn chưa được gán vào hộ khẩu nào.' });
    }

    const invoices = await Invoice.findAll({
      where: { household_id: user.householdId },
      include: [
        { model: FeePeriod, attributes: ['name', 'description'] },
        { model: InvoiceDetail, include: [{ model: FeeType, attributes: ['name'] }] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};