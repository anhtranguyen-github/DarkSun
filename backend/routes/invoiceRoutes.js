// backend/routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Route cho Cư dân xem hóa đơn của mình
router.get('/my-invoices', authorize('Cư dân', 'Tổ trưởng', 'Tổ phó', 'Kế toán', 'Admin'), invoiceController.getMyInvoices);

// Route để phát hành hóa đơn hàng loạt
router.post('/generate-from-period/:feePeriodId', authorize('Kế toán', 'Admin'), invoiceController.generateInvoices);

module.exports = router;