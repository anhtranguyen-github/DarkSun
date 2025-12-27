const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tất cả các route thống kê đều yêu cầu phải đăng nhập
router.use(protect);

// Chỉ Tổ trưởng, Tổ phó, Kế toán, Admin mới có quyền xem thống kê
router.use(authorize('Tổ trưởng', 'Tổ phó', 'Kế toán', 'Admin'));

router.get(
  '/households',
  statisticsController.getHouseholdStats
);

// Route cho thống kê nhân khẩu
router.get('/residents', statisticsController.getResidentStats);

router.get('/residents/export/excel', statisticsController.exportResidentStatsToExcel);
// --- THÊM ROUTE MỚI ĐỂ XUẤT PDF ---
router.get('/residents/export/pdf', statisticsController.exportResidentStatsToPdf);

router.get('/households/export/excel', statisticsController.exportHouseholdStatsToExcel);
// --- THÊM ROUTE MỚI ĐỂ XUẤT PDF ---
router.get('/households/export/pdf', statisticsController.exportHouseholdStatsToPdf);




module.exports = router;