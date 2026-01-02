const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// GET all residents (All roles can view)
router.get('/', authorize('admin', 'manager', 'accountant'), residentController.getAllResidents);

// GET residents by household
router.get('/by-household/:householdId', authorize('admin', 'manager', 'accountant'), residentController.getResidentsByHousehold);

// POST create resident (Manager only)
router.post('/', authorize('admin', 'manager'), residentController.createResident);

// PUT update resident (Manager only)
router.put('/:residentId', authorize('admin', 'manager'), residentController.updateResident);

// DELETE remove resident (Manager only)
router.delete('/:residentId', authorize('admin', 'manager'), residentController.deleteResident);

module.exports = router;