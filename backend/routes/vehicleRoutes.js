const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All vehicle routes require authentication
router.use(protect);

// GET all vehicles (Manager/Accountant can view)
router.get('/', authorize('admin', 'manager', 'accountant'), vehicleController.getAllVehicles);

// GET vehicles by household
router.get('/household/:householdId', authorize('admin', 'manager', 'accountant'), vehicleController.getVehiclesByHousehold);

// POST register a new vehicle (Manager only)
router.post('/', authorize('admin', 'manager'), vehicleController.registerVehicle);

// PUT update vehicle info
router.put('/:id', authorize('admin', 'manager'), vehicleController.updateVehicle);

// DELETE remove vehicle
router.delete('/:id', authorize('admin', 'manager'), vehicleController.deleteVehicle);

module.exports = router;
