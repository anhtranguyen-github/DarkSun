// services/invoiceService.js
const { sequelize, Household, PeriodFee, Invoice, InvoiceDetail } = require('../models');

exports.generateInvoicesForPeriod = async (feePeriodId) => {
  const t = await sequelize.transaction();
  try {
    // 1. Lấy tất cả các khoản thu "Bắt buộc" trong đợt thu này
    const periodFees = await PeriodFee.findAll({
      where: { feePeriodId, type: 'Bắt buộc' },
      transaction: t
    });
    if (periodFees.length === 0) throw new Error('Chưa có khoản thu nào được thêm vào đợt này.');
    
    // 2. Lấy tất cả hộ dân
    const households = await Household.findAll({ where: { status: 'occupied' }, transaction: t });

    // 3. Lặp qua từng hộ dân
    for (const household of households) {
      // Tính tổng tiền cho hóa đơn của hộ này
      const totalAmount = periodFees.reduce((sum, fee) => sum + Number(fee.amount), 0);
      
      // 4. Tạo hóa đơn (Invoice)
      const newInvoice = await Invoice.create({
        householdId: household.id,
        feePeriodId,
        totalAmount,
        status: 'unpaid',
      }, { transaction: t });

      // 5. Tạo các chi tiết hóa đơn (InvoiceDetail)
      for (const fee of periodFees) {
        await InvoiceDetail.create({
          invoiceId: newInvoice.id,
          feeTypeId: fee.feeTypeId,
          quantity: 1, // Giả sử quantity là 1
          priceAtTime: fee.amount,
          amount: fee.amount,
        }, { transaction: t });
      }
    }
    await t.commit();
    return { success: true, message: `Đã tạo hóa đơn thành công cho ${households.length} hộ.` };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};