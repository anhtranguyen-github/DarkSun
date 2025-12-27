const express = require('express');
const router = express.Router();
const periodFeeController = require('../controllers/periodFeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Route để LẤY TẤT CẢ khoản thu trong một đợt
// Bất kỳ ai đã đăng nhập cũng có thể xem
router.get('/in-period/:feePeriodId', periodFeeController.getFeesInPeriod);

// Route để THÊM MỚI một khoản thu vào đợt đó
// Chỉ Kế toán mới được phép
router.post(
  '/in-period/:feePeriodId',
  authorize('Kế toán', 'Admin'),
  periodFeeController.addFeeToPeriod
);

// Route để SỬA hoặc XÓA một khoản thu cụ thể (dựa vào ID của chính nó)
// Chỉ Kế toán mới được phép
router.route('/:periodFeeId')
  .put(authorize('Kế toán', 'Admin'), periodFeeController.updateFeeInPeriod)
  .delete(authorize('Kế toán', 'Admin'), periodFeeController.deleteFeeInPeriod);


module.exports = router;