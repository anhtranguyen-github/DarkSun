const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Statistics are viewable by all management roles (per RBAC)
router.use(authorize('admin', 'manager', 'accountant'));

// Household statistics
router.get('/households', statisticsController.getHouseholdStats);
router.get('/households/export/excel', statisticsController.exportHouseholdStatsToExcel);
router.get('/households/export/pdf', statisticsController.exportHouseholdStatsToPdf);

// Resident statistics
router.get('/residents', statisticsController.getResidentStats);
router.get('/residents/export/excel', statisticsController.exportResidentStatsToExcel);
router.get('/residents/export/pdf', statisticsController.exportResidentStatsToPdf);

module.exports = router;