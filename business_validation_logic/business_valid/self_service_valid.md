# Business Validation: Self service

### Scenarios lọc chọn (Logic & Validation)

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 7 | Gọi `GET /households` | 403 | Xử lý chuẩn | PASS |
| 8 | **Profile kèm `roleId: 1`** | Chặn Mass Assignment | Xử lý chuẩn | **PASS** ✅ |
| 9 | IDOR: Xem hóa đơn nhà khác | Chặn 403 | Không xử lý | FAIL |
| 10 | Upload avatar: File `.bat` | Chặn | Xử lý chuẩn | PASS |
| 11 | Spam đổi mật khẩu | Rate limit | Không xử lý | FAIL |
| 12 | **Cập nhật `status` trái phép** | Chặn | Xử lý chuẩn | **PASS** ✅ |
| 13 | **Cập nhật `householdId` trái phép** | Chặn | Xử lý chuẩn | **PASS** ✅ |
| 14 | **Mật khẩu mới < 6 ký tự** | Báo lỗi | Xử lý chuẩn | **PASS** ✅ |
| 16 | Xem nhân khẩu trong hộ mình | Cho phép | Xử lý chuẩn | PASS |
| 18 | **Xem lịch sử đóng góp** | Chỉ hiện loại voluntary | Xử lý chuẩn | **PASS** ✅ |
| 19 | Truy cập `/reports` | Bị chặn 403 | Xử lý chuẩn | PASS |

---
*Ghi chú: Đã lọc từ self_service_test_report.md dựa trên tiêu chí logic nghiệp vụ và ràng buộc hệ thống.*