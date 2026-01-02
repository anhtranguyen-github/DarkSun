const express = require('express');
const router = express.Router();
const selfServiceController = require('../controllers/selfServiceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All self-service routes require authentication
router.use(protect);

// All authenticated users can access their own data
// (The authorize middleware checks for any of the listed roles)
const anyAuthenticatedRole = ['admin', 'to_truong', 'to_pho', 'ke_toan', 'cu_dan'];

// GET my profile (user info + household)
router.get('/profile', authorize(...anyAuthenticatedRole), selfServiceController.getMyProfile);

// UPDATE my profile (contact info only)
router.put('/profile', authorize(...anyAuthenticatedRole), selfServiceController.updateMyProfile);

// GET my invoices
router.get('/invoices', authorize(...anyAuthenticatedRole), selfServiceController.getMyInvoices);

// GET my payment history
router.get('/payments', authorize(...anyAuthenticatedRole), selfServiceController.getMyPayments);

// GET my contributions
router.get('/contributions', authorize(...anyAuthenticatedRole), selfServiceController.getMyContributions);

module.exports = router;
