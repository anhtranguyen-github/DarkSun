# Business Validation: Billing

### Scenarios lọc chọn (Logic & Validation)

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 2 | Đợt thu không có phí | 400 | Xử lý chuẩn | PASS |
| 3 | Đợt thu không tồn tại | 404 | Xử lý chuẩn | PASS |
| 4 | Tạo hóa đơn đã có | Skip | Xử lý chuẩn | PASS |
| 5 | Thanh toán đã paid | Báo lỗi | Xử lý chuẩn | PASS |
| 6 | IDOR xem hóa đơn khác | Chặn 403 | Không xử lý | FAIL |
| 7 | Số tiền âm | Báo lỗi | Xử lý chuẩn | PASS |
| 8 | Số tiền = 0 | Chấp nhận | Xử lý chuẩn | PASS |
| 10 | Notes > 500 ký tự | Báo lỗi | Xử lý chuẩn | PASS |
| 11 | Notes chứa XSS | Sanitize | Không xử lý | FAIL |
| 12 | Race Condition thanh toán | DB Lock | Xử lý chuẩn | PASS |
| 13 | Hóa đơn không tồn tại | 404 | Xử lý chuẩn | PASS |
| 14 | Tính phí theo m2 (area=0) | Skip | Xử lý chuẩn | PASS |
| 15 | Tính phí theo người (0 người) | Skip | Xử lý chuẩn | PASS |
| 16 | **Sửa invoice đã paid** | Chặn sửa | Xử lý chuẩn | **PASS** ✅ |
| 17 | **Xóa invoice đã paid** | Chặn xóa | Xử lý chuẩn | **PASS** ✅ |
| 18 | **Xóa invoice unpaid** | Cho phép | Xử lý chuẩn | **PASS** ✅ |
| 20 | cashierId auto set | Đúng | Xử lý chuẩn | PASS |
| 21 | **Tự động tính theo Nhân khẩu** | Số người * đơn giá | Logic: (vệ sinh/người) | **PASS** ✅ |
| 22 | **Tự động tính theo Xe máy/Ô tô** | Số xe * đơn giá | Phân loại Oto/XeMay | **PASS** ✅ |
| 23 | **Tự động tính theo Diện tích** | m2 * đơn giá | Logic: (quản lý/m2) | **PASS** ✅ |
| 24 | **Tạo hóa đơn trùng đợt** | Chặn, không tạo lại | Xử lý chuẩn | **PASS** ✅ |
| 25 | **FeePeriod không có phí** | Báo lỗi 400 | Xử lý chuẩn | PASS |

---
*Ghi chú: Đã lọc từ billing_test_report.md dựa trên tiêu chí logic nghiệp vụ và ràng buộc hệ thống.*