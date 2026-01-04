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

  // FIXED: Improved Validation for Name and Unit
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Tên loại phí không được để trống.' });
  }
  if (!unit || typeof unit !== 'string' || unit.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Đơn vị không được để trống.' });
  }
  if (price === undefined || isNaN(price) || price < 0) {
    return res.status(400).json({ success: false, message: 'Đơn giá phải là số dương hợp lệ.' });
  }

  // Sanitization: Trim whitespace and remove scripts
  const sanitizedName = name.trim().replace(/<[^>]*>?/gm, '');
  const sanitizedUnit = unit.trim().replace(/<[^>]*>?/gm, '');

  const newFeeType = await FeeType.create({
    name: sanitizedName,
    unit: sanitizedUnit,
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

  // FIXED: Validation for updates
  if (req.body.name !== undefined && (typeof req.body.name !== 'string' || req.body.name.trim().length === 0)) {
    return res.status(400).json({ message: 'Tên loại phí không được để rỗng.' });
  }
  if (req.body.unit !== undefined && (typeof req.body.unit !== 'string' || req.body.unit.trim().length === 0)) {
    return res.status(400).json({ message: 'Đơn vị không được để rỗng.' });
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

  // FIXED: Enhanced Dependency Checks for Integrity
  const [periodFeeCount, invoiceDetailCount] = await Promise.all([
    PeriodFee.count({ where: { feeTypeId: req.params.id } }),
    InvoiceDetail.count({ where: { feeTypeId: req.params.id } })
  ]);

  if (periodFeeCount > 0 || invoiceDetailCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Không thể xóa: Loại phí này đang được liên kết với ${periodFeeCount} đợt thu hoặc ${invoiceDetailCount} hóa đơn chi tiết.`
    });
  }

  await feeType.destroy();
  res.status(200).json({ success: true, message: 'Xóa loại phí thành công!' });
});