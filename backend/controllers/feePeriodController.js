const { FeePeriod } = require('../models');

exports.getAllFeePeriods = async (req, res) => {
  try {
    const periods = await FeePeriod.findAll({ order: [['startDate', 'DESC']] });
    res.status(200).json({ success: true, data: periods });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

exports.getFeePeriodById = async (req, res) => {
  try {
    const period = await FeePeriod.findByPk(req.params.id);
    if (!period) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đợt thu phí.' });
    }
    res.status(200).json({ success: true, data: period });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

exports.createFeePeriod = async (req, res) => {
  try {
    const { name, startDate, endDate, type, description } = req.body;

    if (!name || !startDate || !endDate) {
        return res.status(400).json({ success: false, message: 'Tên, ngày bắt đầu và ngày kết thúc là bắt buộc.' });
    }

     const newPeriod = await FeePeriod.create({
      name,
      startDate,
      endDate,
      type,
      description
    });
    res.status(201).json({ success: true, data: newPeriod });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};