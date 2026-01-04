const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// User management is Admin-only (per RBAC spec: "Manage User Accounts")
router.get('/', authorize('admin'), userController.getAllUsers);
router.post('/', authorize('admin'), userController.createUser); // Admin creates users directly
router.post('/:userId/assign-role', authorize('admin'), userController.assignRoleToUser);
router.patch('/:userId/status', authorize('admin'), userController.updateUserStatus);
router.put('/:userId/assign-household', authorize('admin'), userController.assignHouseholdToUser);
router.delete('/:userId', authorize('admin'), userController.deleteUser);

module.exports = router;