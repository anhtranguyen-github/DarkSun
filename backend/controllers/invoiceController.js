const { Invoice, InvoiceDetail, FeeType, FeePeriod, Household, Resident, Vehicle, User, sequelize } = require('../models');

// Fee Prices (Could be from DB or ENV)
const FEE_PRICES = {
  SANITATION_PER_PERSON: 6000,
  PARKING_MOTORBIKE: 70000,
  PARKING_CAR: 1200000
};

// GENERATE Invoices for a Period
exports.generateInvoicesForPeriod = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { feePeriodId } = req.params;

    const feePeriod = await FeePeriod.findByPk(feePeriodId);
    if (!feePeriod) {
      return res.status(404).json({ success: false, message: 'Đợt thu không tồn tại.' });
    }

    // Get all households
    const households = await Household.findAll({
      include: [
        { model: Resident }, // For counting members
        { model: Vehicle }   // For counting vehicles
      ]
    });

    let createdCount = 0;
    for (const household of households) {
      // Check if invoice already exists for this period
      const existingInvoice = await Invoice.findOne({
        where: { householdId: household.id, feePeriodId }
      });
      if (existingInvoice) continue; // Skip

      // Calculate Fees
      const residentCount = household.Residents ? household.Residents.length : 0;
      const motoCount = household.Vehicles ? household.Vehicles.filter(v => v.type === 'XeMay').length : 0;
      const carCount = household.Vehicles ? household.Vehicles.filter(v => v.type === 'Oto').length : 0;

      const sanitationFee = residentCount * FEE_PRICES.SANITATION_PER_PERSON;
      const motoFee = motoCount * FEE_PRICES.PARKING_MOTORBIKE;
      const carFee = carCount * FEE_PRICES.PARKING_CAR;

      const totalAmount = sanitationFee + motoFee + carFee;

      if (totalAmount === 0) continue; // No fees to collect

      // Create Invoice
      const invoice = await Invoice.create({
        householdId: household.id,
        feePeriodId,
        totalAmount,
        status: 'unpaid'
      }, { transaction: t });

      // Create Invoice Details (Line items)
      if (sanitationFee > 0) {
        await InvoiceDetail.create({
          invoiceId: invoice.id,
          feeTypeId: 1, // Assuming ID 1 is Sanitation - Should be looked up
          quantity: residentCount,
          priceAtTime: FEE_PRICES.SANITATION_PER_PERSON,
          amount: sanitationFee
        }, { transaction: t });
      }
      // ... Similar for Parking (simplified)

      createdCount++;
    }

    await t.commit();
    res.status(201).json({ success: true, message: `Đã tạo ${createdCount} hóa đơn.` });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// RECORD Payment
exports.recordPayment = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { paymentMethod, notes } = req.body;
    const cashierId = req.user.id; // From JWT

    const invoice = await Invoice.findByPk(invoiceId);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Hóa đơn không tồn tại.' });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({ success: false, message: 'Hóa đơn đã được thanh toán.' });
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