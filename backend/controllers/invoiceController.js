const { Invoice, InvoiceDetail, FeeType, FeePeriod, Household, Resident, Vehicle, User, PeriodFee, sequelize } = require('../models');

// GENERATE Invoices for a Period (v2.0: Dynamic Fee Calculation)
exports.generateInvoicesForPeriod = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { feePeriodId } = req.params;

        const feePeriod = await FeePeriod.findByPk(feePeriodId);
        if (!feePeriod) {
            return res.status(404).json({ success: false, message: 'Đợt thu không tồn tại.' });
        }

        // Get all applicable fees for this specific period
        const applicableFees = await PeriodFee.findAll({
            where: { feePeriodId },
            include: [{ model: FeeType }]
        });

        if (applicableFees.length === 0) {
            return res.status(400).json({ success: false, message: 'Đợt thu này chưa được cấu hình các khoản phí.' });
        }

        // Get all households
        const households = await Household.findAll({
            include: [
                { model: Resident },
                { model: Vehicle }
            ]
        });

        let createdCount = 0;
        for (const household of households) {
            // Check if invoice already exists
            const existingInvoice = await Invoice.findOne({
                where: { householdId: household.id, feePeriodId }
            });
            if (existingInvoice) continue;

            let totalAmount = 0;
            const invoiceItems = [];

            // Calculate each fee type dynamically
            for (const pFee of applicableFees) {
                const feeType = pFee.FeeType;
                const basePrice = Number(pFee.amount);
                let quantity = 0;
                let itemAmount = 0;

                // Determination logic based on unit/name
                if (feeType.name.includes('vệ sinh') || feeType.unit.includes('người')) {
                    quantity = household.Residents ? household.Residents.length : 0;
                } else if (feeType.name.includes('xe máy') || (feeType.name.includes('xe') && !feeType.name.includes('ô tô'))) {
                    quantity = household.Vehicles ? household.Vehicles.filter(v => v.type === 'XeMay').length : 0;
                } else if (feeType.name.includes('ô tô') || feeType.name.includes('Oto')) {
                    quantity = household.Vehicles ? household.Vehicles.filter(v => v.type === 'Oto').length : 0;
                } else if (feeType.name.includes('quản lý') || feeType.unit.includes('m2')) {
                    quantity = Number(household.area) || 0;
                } else {
                    // Default: per household (flat)
                    quantity = 1;
                }

                itemAmount = quantity * basePrice;

                if (itemAmount > 0) {
                    totalAmount += itemAmount;
                    invoiceItems.push({
                        feeTypeId: feeType.id,
                        quantity,
                        priceAtTime: basePrice,
                        amount: itemAmount
                    });
                }
            }

            if (totalAmount > 0) {
                const invoice = await Invoice.create({
                    householdId: household.id,
                    feePeriodId,
                    totalAmount,
                    status: 'unpaid'
                }, { transaction: t });

                // Batch create details
                for (const item of invoiceItems) {
                    await InvoiceDetail.create({
                        ...item,
                        invoiceId: invoice.id
                    }, { transaction: t });
                }
                createdCount++;
            }
        }

        await t.commit();
        res.status(201).json({ success: true, message: `Hệ thống đã tự động tính toán và khởi tạo ${createdCount} hóa đơn dựa trên dữ liệu nhân khẩu thực tế.` });
    } catch (error) {
        if (t) await t.rollback();
        console.error("GENERATE INVOICE ERROR:", error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// RECORD Payment
exports.recordPayment = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const { paymentMethod, notes, amount } = req.body;
        const cashierId = req.user.id;

        // FIXED: Chặn số tiền âm (Validation)
        if (amount !== undefined && amount < 0) {
            return res.status(400).json({ success: false, message: 'Số tiền không hợp lệ (Không được âm).' });
        }

        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Hóa đơn không tồn tại.' });
        }

        // FIXED: KIỂM TRA TRẠNG THÁI: Nếu đã paid thì không cho đóng tiền tiếp (Business Logic)
        if (invoice.status === 'paid') {
            return res.status(400).json({
                success: false,
                message: `Hóa đơn này đã được thanh toán vào ngày ${new Date(invoice.paidDate).toLocaleDateString()}. Không thể thực hiện lại thao tác.`
            });
        }

        // FIXED: Thêm validation cho notes
        if (notes && notes.length > 500) {
            return res.status(400).json({ message: 'Ghi chú quá dài (Tối đa 500 ký tự).' });
        }

        await invoice.update({
            status: 'paid',
            paidDate: new Date(),
            paymentMethod: paymentMethod || 'TienMat',
            cashierId,
            notes
        });

        res.status(200).json({ success: true, message: 'Ghi nhận thanh toán thành công.', data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// GET Invoices by Household
exports.getInvoicesByHousehold = async (req, res) => {
    try {
        const { householdId } = req.params;
        const invoices = await Invoice.findAll({
            where: { householdId },
            include: [
                { model: FeePeriod, attributes: ['name', 'startDate', 'endDate'] },
                { model: InvoiceDetail, include: [{ model: FeeType, attributes: ['name', 'unit'] }] }
            ],
            order: [['created_at', 'DESC']]
        });
        res.status(200).json({ success: true, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// GET All Invoices (Admin/Accountant View)
exports.getAllInvoices = async (req, res) => {
    try {
        const { status, feePeriodId } = req.query;
        const whereClause = {};
        if (status) whereClause.status = status;
        if (feePeriodId) whereClause.feePeriodId = feePeriodId;

        const invoices = await Invoice.findAll({
            where: whereClause,
            include: [
                { model: Household, attributes: ['householdCode', 'address'] },
                { model: FeePeriod, attributes: ['name'] },
                { model: User, as: 'Cashier', attributes: ['fullName'] }
            ],
            order: [['created_at', 'DESC']]
        });
        res.status(200).json({ success: true, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// UPDATE Invoice (with paid status protection)
exports.updateInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const invoice = await Invoice.findByPk(invoiceId);

        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Hóa đơn không tồn tại.' });
        }

        // FIXED: Block editing paid invoices
        if (invoice.status === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Không thể sửa hóa đơn đã thanh toán. Vui lòng liên hệ quản trị viên.'
            });
        }

        await invoice.update(req.body);
        res.status(200).json({ success: true, message: 'Cập nhật hóa đơn thành công!', data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// DELETE Invoice (with paid status protection)
exports.deleteInvoice = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const invoice = await Invoice.findByPk(invoiceId);

        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Hóa đơn không tồn tại.' });
        }

        // FIXED: Block deleting paid invoices
        if (invoice.status === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa hóa đơn đã thanh toán. Đây là bản ghi kế toán quan trọng.'
            });
        }

        // Delete invoice details first
        await InvoiceDetail.destroy({ where: { invoiceId: invoice.id } });
        await invoice.destroy();

        res.status(200).json({ success: true, message: 'Xóa hóa đơn thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};
