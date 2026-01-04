# Báo cáo Sửa lỗi: Module Fee Type

**Cập nhật:** 2026-01-04

## Lỗi đã phát hiện và sửa

### BUG-FT-01: Empty Name/Unit
- **Mô tả:** Cho phép tạo loại phí với tên/đơn vị rỗng
- **Nguyên nhân:** Không validate required
- **Giải pháp:** Check `name.trim().length > 0`
- **File:** `financeController.js` line 30-35

### BUG-FT-02: Negative Price
- **Mô tả:** Cho phép nhập giá âm
- **Nguyên nhân:** Không validate số dương
- **Giải pháp:** Kiểm tra `price >= 0`
- **File:** `financeController.js`

### BUG-FT-03: Delete In Use
- **Mô tả:** Có thể xóa loại phí đang được sử dụng
- **Nguyên nhân:** Không kiểm tra dependency
- **Giải pháp:** Check PeriodFee và InvoiceDetail count
- **File:** `financeController.js` line 67-83
