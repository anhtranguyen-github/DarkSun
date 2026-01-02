const express = require('express');
const router = express.Router();
const feeTypeController = require('../controllers/financeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// GET all fee types (All roles can view)
router.get('/', authorize('admin', 'manager', 'accountant'), feeTypeController.getAllFeeTypes);

// GET fee type by ID
router.get('/:id', authorize('admin', 'manager', 'accountant'), feeTypeController.getFeeTypeById);

// POST create fee type (Accountant only - per RBAC spec)
router.post('/', authorize('admin', 'accountant'), feeTypeController.createFeeType);

// PUT update fee type (Accountant only)
router.put('/:id', authorize('admin', 'accountant'), feeTypeController.updateFeeType);

// DELETE fee type (Admin only for safety)
router.delete('/:id', authorize('admin'), feeTypeController.deleteFeeType);

module.exports = router;