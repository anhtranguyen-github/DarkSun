# Báo cáo Sửa lỗi: Module Billing

**Cập nhật:** 2026-01-04

## Lỗi đã phát hiện và sửa

### BUG-BIL-01: Double Payment
- **Mô tả:** Hệ thống cho phép thanh toán hóa đơn đã paid lần nữa
- **Giải pháp:** Kiểm tra `invoice.status === 'paid'` trước khi xử lý
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-BIL-02: Negative Amount
- **Mô tả:** Có thể ghi nhận số tiền âm
- **Giải pháp:** Validation `amount >= 0`
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-BIL-03: Notes Length
- **Mô tả:** Ghi chú có thể rất dài gây lỗi DB
- **Giải pháp:** Giới hạn 500 ký tự
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-BIL-04: Edit Paid Invoice (**MỚI**)
- **Mô tả:** Có thể sửa hóa đơn đã thanh toán
- **Giải pháp:** Thêm `updateInvoice()` với check status
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-BIL-05: Delete Paid Invoice (**MỚI**)
- **Mô tả:** Có thể xóa hóa đơn đã thanh toán
- **Giải pháp:** Thêm `deleteInvoice()` với check status
- **Trạng thái:** ✅ ĐÃ SỬA

---

## File đã sửa:
- `backend/controllers/invoiceController.js`
