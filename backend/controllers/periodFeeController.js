const { PeriodFee, FeeType, Invoice } = require('../models');

/**
 * POST: Thêm một khoản thu (loại phí) vào một đợt thu.
 * Route: /api/period-fees/in-period/:feePeriodId
 */
exports.addFeeToPeriod = async (req, res) => {
  try {
    const { feePeriodId } = req.params;
    const { feeTypeId, amount, description, type } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!feeTypeId || !amount) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp Loại phí và Số tiền.' });
    }

    // Kiểm tra xem khoản thu này đã được thêm vào đợt thu chưa để tránh trùng lặp
    const existingFee = await PeriodFee.findOne({
      where: {
        fee_period_id: feePeriodId,
        fee_type_id: feeTypeId
      }
    });

    if (existingFee) {
      return res.status(409).json({ success: false, message: 'Loại phí này đã được thêm vào đợt thu.' });
    }

    const newPeriodFee = await PeriodFee.create({
      feePeriodId,
      feeTypeId,
      amount,
      description,
      type
    });

    res.status(201).json({ success: true, message: 'Thêm khoản thu vào đợt thành công!', data: newPeriodFee });
  } catch (error) {
    console.error("LỖI KHI THÊM KHOẢN THU VÀO ĐỢT:", error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * GET: Lấy tất cả các khoản thu trong một đợt thu cụ thể.
 * Route: /api/period-fees/in-period/:feePeriodId
 */
exports.getFeesInPeriod = async (req, res) => {
  try {
    const { feePeriodId } = req.params;
    const fees = await PeriodFee.findAll({
      where: { fee_period_id: feePeriodId },
      include: {
        model: FeeType, // Lấy thông tin chi tiết của Loại phí (tên, đơn vị)
        attributes: ['name', 'unit']
      },
      order: [['created_at', 'ASC']]
    });

    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    console.error("LỖI KHI LẤY KHOẢN THU TRONG ĐỢT:", error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * PUT: Cập nhật một khoản thu cụ thể trong một đợt thu.
 * Route: /api/period-fees/:periodFeeId
 */
exports.updateFeeInPeriod = async (req, res) => {
  try {
    const { periodFeeId } = req.params;
    const { amount, description, type } = req.body; // Chỉ cho phép cập nhật các trường này

    const periodFee = await PeriodFee.findByPk(periodFeeId);
    if (!periodFee) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khoản thu này.' });
    }

    // Cập nhật các trường được phép
    periodFee.amount = amount ?? periodFee.amount;
    periodFee.description = description ?? periodFee.description;
    periodFee.type = type ?? periodFee.type;

    await periodFee.save();

    res.status(200).json({ success: true, message: 'Cập nhật khoản thu thành công!', data: periodFee });
  } catch (error) {
    console.error("LỖI KHI CẬP NHẬT KHOẢN THU:", error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * DELETE: Xóa một khoản thu khỏi một đợt thu.
 * Route: /api/period-fees/:periodFeeId
 */
exports.deleteFeeInPeriod = async (req, res) => {
  try {
    const { periodFeeId } = req.params;
    const periodFee = await PeriodFee.findByPk(periodFeeId);
    if (!periodFee) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khoản thu này.' });
    }

    // Logic kiểm tra nâng cao: Không cho xóa nếu đã có hóa đơn được tạo cho đợt thu này
    const existingInvoice = await Invoice.findOne({ where: { fee_period_id: periodFee.feePeriodId } });
    if (existingInvoice) {
        return res.status(400).json({ success: false, message: 'Không thể xóa. Đợt thu này đã được phát hành hóa đơn.' });
    }

    await periodFee.destroy();

    res.status(200).json({ success: true, message: 'Xóa khoản thu khỏi đợt thành công!' });
  } catch (error) {
    console.error("LỖI KHI XÓA KHOẢN THU:", error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};