const { FeePeriod } = require('../models');
const { asyncHandler } = require('../middleware/errorMiddleware');

// GET all fee periods
exports.getAllFeePeriods = asyncHandler(async (req, res) => {
  const { status, type } = req.query;
  const whereClause = {};

  if (status) whereClause.status = status;
  if (type) whereClause.type = type;

  const periods = await FeePeriod.findAll({
    where: whereClause,
    order: [['startDate', 'DESC']]
  });
  res.status(200).json({ success: true, data: periods });
});

// GET fee period by ID
exports.getFeePeriodById = asyncHandler(async (req, res) => {
  const period = await FeePeriod.findByPk(req.params.id);
  if (!period) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đợt thu phí.' });
  }
  res.status(200).json({ success: true, data: period });
});

// CREATE new fee period
exports.createFeePeriod = asyncHandler(async (req, res) => {
  const { name, startDate, endDate, type, description } = req.body;

  if (!name || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Các trường bắt buộc: Tên đợt, Ngày bắt đầu, Ngày kết thúc.'
    });
  }

  // Validate date range
  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({
      success: false,
      message: 'Ngày bắt đầu phải trước ngày kết thúc.'
    });
  }

  const newPeriod = await FeePeriod.create({
    name,
    startDate,
    endDate,
    type: type || 'mandatory',
    description,
    status: 'open'
  });

  res.status(201).json({ success: true, message: 'Tạo đợt thu phí thành công!', data: newPeriod });
});

// UPDATE fee period
exports.updateFeePeriod = asyncHandler(async (req, res) => {
  const period = await FeePeriod.findByPk(req.params.id);
  if (!period) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đợt thu phí.' });
  }

  await period.update(req.body);
  res.status(200).json({ success: true, message: 'Cập nhật thành công!', data: period });
});

// CLOSE fee period (stop accepting payments)
exports.closeFeePeriod = asyncHandler(async (req, res) => {
  const period = await FeePeriod.findByPk(req.params.id);
  if (!period) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đợt thu phí.' });
  }

  await period.update({ status: 'closed' });
  res.status(200).json({ success: true, message: 'Đã đóng đợt thu phí.' });
});