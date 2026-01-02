const { FeeType, PeriodFee, InvoiceDetail } = require('../models');
const { asyncHandler } = require('../middleware/errorMiddleware');

// GET all fee types
exports.getAllFeeTypes = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const whereClause = {};
  if (category) whereClause.category = category;

  const feeTypes = await FeeType.findAll({
    where: whereClause,
    order: [['name', 'ASC']]
  });
  res.status(200).json({ success: true, data: feeTypes });
});

// GET fee type by ID
exports.getFeeTypeById = asyncHandler(async (req, res) => {
  const feeType = await FeeType.findByPk(req.params.id);
  if (!feeType) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy loại phí.' });
  }
  res.status(200).json({ success: true, data: feeType });
});

// CREATE new fee type
exports.createFeeType = asyncHandler(async (req, res) => {
  const { name, unit, price, description, category } = req.body;

  if (!name || !unit || price === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Các trường bắt buộc: Tên, Đơn vị, Đơn giá.'
    });
  }

  const newFeeType = await FeeType.create({
    name,
    unit,
    price,
    description,
    category: category || 'mandatory'
  });

  res.status(201).json({ success: true, message: 'Tạo loại phí thành công!', data: newFeeType });
});

// UPDATE fee type
exports.updateFeeType = asyncHandler(async (req, res) => {
  const feeType = await FeeType.findByPk(req.params.id);
  if (!feeType) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy loại phí.' });
  }

  await feeType.update(req.body);
  res.status(200).json({ success: true, message: 'Cập nhật thành công!', data: feeType });
});

// DELETE fee type (with dependency check)
exports.deleteFeeType = asyncHandler(async (req, res) => {
  const feeType = await FeeType.findByPk(req.params.id);
  if (!feeType) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy loại phí.' });
  }

  // Check if being used
  const periodFeeCount = await PeriodFee.count({ where: { feeTypeId: req.params.id } });
  if (periodFeeCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Không thể xóa: Đang được sử dụng trong ${periodFeeCount} đợt thu phí.`
    });
  }

  const invoiceDetailCount = await InvoiceDetail.count({ where: { feeTypeId: req.params.id } });
  if (invoiceDetailCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Không thể xóa: Đang có ${invoiceDetailCount} hóa đơn chi tiết liên quan.`
    });
  }

  await feeType.destroy();
  res.status(200).json({ success: true, message: 'Xóa loại phí thành công!' });
});