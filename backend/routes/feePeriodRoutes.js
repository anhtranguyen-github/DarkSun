// routes/feePeriodRoutes.js
const express = require('express');
const router = express.Router();
const feePeriodController = require('../controllers/feePeriodController'); // Bạn sẽ cần tạo controller này
const financeController = require('../controllers/financeController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tất cả các route dưới đây đều yêu cầu đăng nhập và phải là Kế toán
router.use(protect);

router.route('/')
  // SỬA Ở ĐÂY: Cho phép các vai trò khác xem danh sách
  .get(authorize('Kế toán', 'Tổ trưởng', 'Tổ phó', 'Cư dân', 'Admin'), feePeriodController.getAllFeePeriods)
  .post(authorize('Kế toán', 'Admin'), feePeriodController.createFeePeriod);

router.route('/:id')
  // SỬA Ở ĐÂY: Cho phép các vai trò khác xem chi tiết
  .get(authorize('Kế toán', 'Tổ trưởng', 'Tổ phó', 'Cư dân', 'Admin'), feePeriodController.getFeePeriodById);

// Chỉ Kế toán/Admin mới được lập hóa đơn
router.post('/:feePeriodId/generate-invoices', authorize('Kế toán', 'Admin'), financeController.generateInvoices);

module.exports = router;