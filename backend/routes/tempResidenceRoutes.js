const express = require('express');
const router = express.Router();
const tempResidenceController = require('../controllers/tempResidenceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// GET all temporary residence records (Manager only)
router.get('/', authorize('admin', 'manager'), tempResidenceController.getTemporaryResidences);

// POST register new temporary residence/absence (Manager only)
router.post('/', authorize('admin', 'manager'), tempResidenceController.registerTemporaryResidence);

module.exports = router;
