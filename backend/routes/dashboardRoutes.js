const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Dashboard is viewable by all management roles
router.get('/stats', authorize('admin', 'manager', 'accountant'), dashboardController.getDashboardStats);

module.exports = router;