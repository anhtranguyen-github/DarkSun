const express = require('express');
const router = express.Router();
const householdController = require('../controllers/householdController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// GET all households (Manager, Deputy & Accountant can view)
router.get('/', authorize('admin', 'manager', 'deputy', 'accountant'), householdController.getAllHouseholds);

// GET household details with residents & vehicles
router.get('/:id', authorize('admin', 'manager', 'deputy', 'accountant'), householdController.getHouseholdDetails);

// POST create new household (Manager only)
router.post('/', authorize('admin', 'manager'), householdController.createHousehold);

// PUT update household info
router.put('/:id', authorize('admin', 'manager'), householdController.updateHousehold);

// PUT change owner
router.put('/:id/change-owner', authorize('admin', 'manager'), householdController.changeOwner);

module.exports = router;