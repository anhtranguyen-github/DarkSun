// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware'); // Import middleware

// Áp dụng middleware "protect" cho tất cả các route trong file này
router.use(protect);

router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;