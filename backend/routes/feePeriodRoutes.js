const express = require('express');
const router = express.Router();
const feePeriodController = require('../controllers/feePeriodController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// GET all fee periods (All roles can view)
router.get('/', authorize('admin', 'manager', 'accountant'), feePeriodController.getAllFeePeriods);

// GET fee period by ID
router.get('/:id', authorize('admin', 'manager', 'accountant'), feePeriodController.getFeePeriodById);

// POST create fee period (Accountant only)
router.post('/', authorize('admin', 'accountant'), feePeriodController.createFeePeriod);

// PUT update fee period (Accountant only)
router.put('/:id', authorize('admin', 'accountant'), feePeriodController.updateFeePeriod);

module.exports = router;