const express = require('express');
const router = express.Router();
const periodFeeController = require('../controllers/periodFeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// GET fees in a period (Viewable by all management roles)
router.get('/in-period/:feePeriodId', authorize('admin', 'manager', 'accountant'), periodFeeController.getFeesInPeriod);

// POST add fee to period (Accountant only)
router.post('/in-period/:feePeriodId', authorize('admin', 'accountant'), periodFeeController.addFeeToPeriod);

// PUT/DELETE specific period fee (Accountant only)
router.route('/:periodFeeId')
  .put(authorize('admin', 'accountant'), periodFeeController.updateFeeInPeriod)
  .delete(authorize('admin', 'accountant'), periodFeeController.deleteFeeInPeriod);

module.exports = router;