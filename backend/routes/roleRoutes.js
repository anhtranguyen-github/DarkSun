// routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Chỉ cần đăng nhập là có thể lấy danh sách vai trò
router.get('/', roleController.getAllRoles);

module.exports = router;