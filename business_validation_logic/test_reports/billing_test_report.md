# Báo cáo Kiểm thử: Quản lý Thu phí & Hóa đơn (Billing)

**Cập nhật:** 2026-01-04 | **Phiên bản:** 2.1

### Chi tiết kịch bản kiểm thử

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Tạo hóa đơn tự động | Tạo đúng số | Xử lý chuẩn | PASS |
| 2 | Đợt thu không có phí | 400 | Xử lý chuẩn | PASS |
| 3 | Đợt thu không tồn tại | 404 | Xử lý chuẩn | PASS |
| 4 | Tạo hóa đơn đã có | Skip | Xử lý chuẩn | PASS |
| 5 | Thanh toán đã paid | Báo lỗi | Xử lý chuẩn | PASS |
| 6 | IDOR xem hóa đơn khác | Chặn 403 | Không xử lý | FAIL |
| 7 | Số tiền âm | Báo lỗi | Xử lý chuẩn | PASS |
| 8 | Số tiền = 0 | Chấp nhận | Xử lý chuẩn | PASS |
| 9 | Payment Method lạ | Default | Xử lý chuẩn | PASS |
| 10 | Notes > 500 ký tự | Báo lỗi | Xử lý chuẩn | PASS |
| 11 | Notes chứa XSS | Sanitize | Không xử lý | FAIL |
| 12 | Race Condition thanh toán | DB Lock | Xử lý chuẩn | PASS |
| 13 | Hóa đơn không tồn tại | 404 | Xử lý chuẩn | PASS |
| 14 | Tính phí theo m2 (area=0) | Skip | Xử lý chuẩn | PASS |
| 15 | Tính phí theo người (0 người) | Skip | Xử lý chuẩn | PASS |
| 16 | **Sửa invoice đã paid** | Chặn sửa | Xử lý chuẩn | **PASS** ✅ |
| 17 | **Xóa invoice đã paid** | Chặn xóa | Xử lý chuẩn | **PASS** ✅ |
| 18 | **Xóa invoice unpaid** | Cho phép | Xử lý chuẩn | **PASS** ✅ |
| 19 | paidDate auto set | Đúng | Xử lý chuẩn | PASS |
| 20 | cashierId auto set | Đúng | Xử lý chuẩn | PASS |

---

### Tổng kết: 18 PASS | 2 FAIL

**Các lỗi đã sửa trong phiên bản này:**
- ✅ Edit paid invoice blocking
- ✅ Delete paid invoice blocking
- ✅ Delete unpaid invoice with cascade (InvoiceDetail)
