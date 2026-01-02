const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// GET all roles (Admin only for security)
router.get('/', authorize('admin'), roleController.getAllRoles);

module.exports = router;