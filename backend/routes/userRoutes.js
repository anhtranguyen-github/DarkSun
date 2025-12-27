// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tất cả các route trong file này đều yêu cầu đăng nhập
router.use(protect);

// Áp dụng middleware phân quyền cho từng nhóm route
const managerRoles = ['Admin', 'Tổ trưởng', 'Tổ phó'];

router.get('/', authorize(...managerRoles), userController.getAllUsers);
router.post('/:userId/assign-role', authorize(...managerRoles), userController.assignRoleToUser);
router.patch('/:userId/status', authorize(...managerRoles), userController.updateUserStatus);
router.put('/:userId/assign-household', authorize(...managerRoles), userController.assignHouseholdToUser);
router.delete('/:userId', authorize(...managerRoles), userController.deleteUser);

module.exports = router;