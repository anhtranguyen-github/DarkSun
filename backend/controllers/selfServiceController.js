/**
 * Self-Service Controller (Cổng Cư Dân)
 * Handles resident self-service operations
 */
const { User, Household, Resident, Invoice, InvoiceDetail, FeeType, FeePeriod } = require('../models');

// GET My Profile (User info + Household + Residents)
exports.getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            attributes: ['id', 'username', 'fullName', 'email', 'phone_number', 'status'],
            include: [{
                model: Household,
                include: [{
                    model: Resident,
                    attributes: ['id', 'fullName', 'dateOfBirth', 'gender', 'relationship']
                }]
            }]
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// UPDATE My Profile (Only contact info)
exports.updateMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { email, phone_number } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
        }

        // FIXED: Mass Assignment Protection - Only allow specific fields
        const allowedUpdates = ['email', 'phone_number', 'fullName'];
        const updateData = {};

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updateData[key] = req.body[key];
            }
        });

        // Prevention of role escalation
        if (req.body.roleId || req.body.roles || req.body.status) {
            return res.status(403).json({ message: 'Bạn không có quyền cập nhật các trường hệ thống nhạy cảm.' });
        }

        await user.update(updateData);

        res.status(200).json({ success: true, message: 'Cập nhật thành công!', data: updateData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// GET My Invoices (Invoices for user's household)
exports.getMyInvoices = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user || !user.householdId) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'Bạn chưa được liên kết với hộ khẩu nào.'
            });
        }

        const invoices = await Invoice.findAll({
            where: { householdId: user.householdId },
            include: [
                { model: FeePeriod, attributes: ['name', 'startDate', 'endDate'] },
                {
                    model: InvoiceDetail,
                    include: [{ model: FeeType, attributes: ['name', 'unit'] }]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({ success: true, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// GET My Payments (Paid invoices history)
exports.getMyPayments = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user || !user.householdId) {
            return res.status(200).json({ success: true, data: [] });
        }

        const payments = await Invoice.findAll({
            where: {
                householdId: user.householdId,
                status: 'paid'
            },
            include: [
                { model: FeePeriod, attributes: ['name'] }
            ],
            order: [['paidDate', 'DESC']]
        });

        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// GET My Contributions
exports.getMyContributions = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user || !user.householdId) {
            return res.status(200).json({ success: true, data: [] });
        }

        // Get contribution-type invoices
        const contributions = await Invoice.findAll({
            where: { householdId: user.householdId },
            include: [
                {
                    model: FeePeriod,
                    where: { type: 'contribution' },
                    attributes: ['name', 'description']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({ success: true, data: contributions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};
