const express = require('express');
const router = express.Router();

// Import các file route của bạn
const authRoutes = require('./authRoutes');
const feeTypeRoutes = require('./feeTypeRoutes');
const feePeriodRoutes = require('./feePeriodRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const roleRoutes = require('./roleRoutes'); 
const userRoutes = require('./userRoutes');
const residentRoutes = require('./residentRoutes');
const statisticsRoutes = require('./statisticsRoutes');
// Thêm các file routes khác mà bạn đã tạo code khung ở đây
const householdRoutes = require('./householdRoutes');
const periodFeeRoutes = require('./periodFeeRoutes');
const invoiceRoutes = require('./invoiceRoutes');
// const userRoutes = require('./userRoutes');

// Gán các route vào đường dẫn tương ứng
router.use('/auth', authRoutes);
router.use('/fee-periods', feePeriodRoutes); // Route cho kỳ thu phí
router.use('/fee-types', feeTypeRoutes); // Route cho loại phí (có thể gộp chung với financeRoutes nếu cần)
router.use('/dashboard', dashboardRoutes); // Route cho dashboard
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/households', householdRoutes);
router.use('/residents', residentRoutes); // Route cho nhân khẩu
router.use('/statistics', statisticsRoutes);
router.use('/period-fees', periodFeeRoutes);
router.use('/invoices', invoiceRoutes);

// router.use('/users', userRoutes);

// Export router chính để server.js có thể sử dụng
module.exports = router;