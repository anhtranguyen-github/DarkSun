// THAY ĐỔI Ở ĐÂY: Import model và service
const { Invoice, InvoiceDetail, FeeType, FeePeriod } = require('../models');
const invoiceService = require('../services/invoiceService');

// CREATE a new FeeType
exports.createFeeType = async (req, res) => {
  try {
    const { name, unit, price, description } = req.body;
    if (!name || !unit || !price) {
      return res.status(400).json({ success: false, message: 'Tên, đơn vị và đơn giá là bắt buộc.' });
    }
    const newFeeType = await FeeType.create({ name, unit, price, description });
    res.status(201).json({ success: true, message: 'Tạo loại phí thành công!', data: newFeeType });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// GET all FeeTypes
exports.getAllFeeTypes = async (req, res) => {
  try {
    const feeTypes = await FeeType.findAll({ order: [['name', 'ASC']] });
    res.status(200).json({ success: true, data: feeTypes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// GET a single FeeType by ID
exports.getFeeTypeById = async (req, res) => {
  try {
    const feeType = await FeeType.findByPk(req.params.id);
    if (!feeType) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại phí.' });
    }
    res.status(200).json({ success: true, data: feeType });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// UPDATE a FeeType
exports.updateFeeType = async (req, res) => {
  try {
    const { name, unit, price, description } = req.body;
    const feeType = await FeeType.findByPk(req.params.id);
    if (!feeType) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại phí.' });
    }
    await feeType.update({ name, unit, price, description });
    res.status(200).json({ success: true, message: 'Cập nhật loại phí thành công!', data: feeType });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// DELETE a FeeType
exports.deleteFeeType = async (req, res) => {
  try {
    const feeType = await FeeType.findByPk(req.params.id);
    if (!feeType) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại phí.' });
    }

    // Check if FeeType is being used in PeriodFee or InvoiceDetail
    const { PeriodFee, InvoiceDetail } = require('../models');

    const periodFeeCount = await PeriodFee.count({ where: { feeTypeId: req.params.id } });
    if (periodFeeCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa loại phí này vì đang được sử dụng trong ${periodFeeCount} đợt thu phí.`
      });
    }

    const invoiceDetailCount = await InvoiceDetail.count({ where: { fee_type_id: req.params.id } });
    if (invoiceDetailCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa loại phí này vì đang được sử dụng trong ${invoiceDetailCount} chi tiết hóa đơn.`
      });
    }

    await feeType.destroy();
    res.status(200).json({ success: true, message: 'Xóa loại phí thành công!' });
  } catch (error) {
    console.error('Error deleting FeeType:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

exports.generateInvoices = async (req, res) => {
  try {
    const { feePeriodId } = req.params;
    const result = await invoiceService.generateInvoicesForPeriod(feePeriodId);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// GET: Lấy tất cả hóa đơn của hộ khẩu mà người dùng đang đăng nhập thuộc về
exports.getMyInvoices = async (req, res) => {
  try {
    // Giả sử middleware đã xác định được người dùng thuộc hộ khẩu nào
    // Đây là một logic phức tạp cần làm sau, tạm thời hardcode
    const householdId = req.user.householdId; // Sẽ cần thêm householdId vào token hoặc CSDL User

    if (!householdId) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin hộ khẩu của bạn.' });
    }

    const invoices = await Invoice.findAll({
      where: { householdId },
      include: [
        { model: FeePeriod, attributes: ['name', 'description'] },
        // Lấy chi tiết hóa đơn
        { model: InvoiceDetail, include: [{ model: FeeType, attributes: ['name', 'unit'] }] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};