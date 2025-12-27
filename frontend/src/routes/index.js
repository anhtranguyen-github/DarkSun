// backend/routes/index.js

const express = require('express');
const router = express.Router();

// Import tất cả các file route của bạn
const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const feeTypeRoutes = require('./feeTypeRoutes');
const feePeriodRoutes = require('./feePeriodRoutes');
const householdRoutes = require('./householdRoutes');
const residentRoutes = require('./residentRoutes');
const userRoutes = require('./userRoutes');
const statisticsRoutes = require('./statisticsRoutes'); 

// Gán các route vào đường dẫn tương ứng
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/fee-types', feeTypeRoutes);
router.use('/fee-periods', feePeriodRoutes);
router.use('/households', householdRoutes);
router.use('/residents', residentRoutes);
router.use('/users', userRoutes);
router.use('/statistics', statisticsRoutes); // <<< VÀ ĐẢM BẢO DÒNG NÀY TỒN TẠI

module.exports = router;