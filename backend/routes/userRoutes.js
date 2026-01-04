const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// User management (Admin & Manager)
router.get('/', authorize('admin', 'manager'), userController.getAllUsers);
router.post('/', authorize('admin', 'manager'), userController.createUser);
router.post('/:userId/assign-role', authorize('admin', 'manager'), userController.assignRoleToUser);

router.put('/:userId/assign-household', authorize('admin', 'manager'), userController.assignHouseholdToUser);
router.delete('/:userId', authorize('admin', 'manager'), userController.deleteUser);

module.exports = router;