const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route for registration
router.get('/', roleController.getAllRoles);

module.exports = router;