// routes/feeTypeRoutes.js
const express = require('express');
const router = express.Router();
const feeTypeController = require('../controllers/financeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tất cả các route dưới đây đều yêu cầu phải đăng nhập
router.use(protect);

router.route('/')
  // Kế toán HOẶC Tổ trưởng đều có thể xem danh sách
  .get(authorize('Kế toán', 'Tổ trưởng', 'Tổ phó', 'Cư dân', 'Admin'), feeTypeController.getAllFeeTypes)
  // Chỉ Kế toán hoặc Admin mới được tạo
  .post(authorize('Kế toán', 'Admin'), feeTypeController.createFeeType);

router.route('/:id')
  .get(authorize('Kế toán', 'Tổ trưởng', 'Tổ phó', 'Cư dân', 'Admin'), feeTypeController.getFeeTypeById)
  .put(authorize('Kế toán', 'Admin'), feeTypeController.updateFeeType)
  .delete(authorize('Kế toán', 'Admin'), feeTypeController.deleteFeeType);

module.exports = router;