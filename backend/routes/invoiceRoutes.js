const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// GET my invoices (Resident - view their own household invoices)
router.get('/my-invoices', invoiceController.getMyInvoices);

// GET all invoices (Accountant/Admin)
router.get('/', authorize('admin', 'accountant'), invoiceController.getAllInvoices);

// GET invoices by household
router.get('/household/:householdId', authorize('admin', 'manager', 'accountant'), invoiceController.getInvoicesByHousehold);

// POST generate invoices for a fee period (Accountant only)
router.post('/generate/:feePeriodId', authorize('admin', 'accountant'), invoiceController.generateInvoicesForPeriod);

// PUT record payment (Accountant only)
router.put('/:invoiceId/pay', authorize('admin', 'accountant'), invoiceController.recordPayment);

module.exports = router;