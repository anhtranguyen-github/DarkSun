// routes/residentRoutes.js
const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Tổ trưởng', 'Tổ phó', 'Admin'));

// Định nghĩa lại các route theo chuẩn CRUD
router.route('/')
  .get(residentController.getAllResidents)
  .post(residentController.createResident);

router.route('/:residentId')
  .put(residentController.updateResident)
  .delete(residentController.deleteResident);

  // === ROUTE ĐẶC BIỆT ĐỂ LẤY NHÂN KHẨU THEO HỘ ===
// Route này phải được định nghĩa để khớp với yêu cầu từ frontend
// GET /api/residents/by-household/4
router.get(
  '/by-household/:householdId',
  residentController.getResidentsByHousehold
);

module.exports = router;