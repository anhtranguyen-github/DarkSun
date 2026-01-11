const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Statistics are viewable by all management roles (per RBAC)
router.use(authorize('admin', 'manager', 'deputy', 'accountant'));

// Household statistics
router.get('/households', statisticsController.getHouseholdStats);
router.get('/households/export/excel', statisticsController.exportHouseholdStatsToExcel);
router.get('/households/export/pdf', statisticsController.exportHouseholdStatsToPdf);

// Resident statistics
router.get('/residents', statisticsController.getResidentStats);
router.get('/residents/export/excel', statisticsController.exportResidentStatsToExcel);
router.get('/residents/export/pdf', statisticsController.exportResidentStatsToPdf);

// Fee Collection statistics (UC11)
router.get('/fees', statisticsController.getFeeCollectionStats);
router.get('/fees/export/excel', statisticsController.exportFeeCollectionStatsToExcel);
router.get('/fees/export/pdf', statisticsController.exportFeeCollectionStatsToPdf);

module.exports = router;