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
const householdRoutes = require('./householdRoutes');
const periodFeeRoutes = require('./periodFeeRoutes');
const invoiceRoutes = require('./invoiceRoutes');
const vehicleRoutes = require('./vehicleRoutes'); // NEW v2.0
const tempResidenceRoutes = require('./tempResidenceRoutes'); // NEW v2.0
const selfServiceRoutes = require('./selfServiceRoutes'); // NEW v2.0

// Gán các route vào đường dẫn tương ứng
router.use('/auth', authRoutes);
router.use('/fee-periods', feePeriodRoutes);
router.use('/fee-types', feeTypeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/households', householdRoutes);
router.use('/residents', residentRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/period-fees', periodFeeRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/vehicles', vehicleRoutes); // NEW v2.0
router.use('/temp-residences', tempResidenceRoutes); // NEW v2.0
router.use('/me', selfServiceRoutes); // NEW v2.0 (Resident path)

// Export router chính để server.js có thể sử dụng
module.exports = router;