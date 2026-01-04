# Business Validation: Vehicle

### Scenarios lọc chọn (Logic & Validation)

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 2 | Trùng biển số | 409 "Biển số đã tồn tại" | Xử lý chuẩn | PASS |
| 3 | Hộ khẩu không tồn tại | 404 | Xử lý chuẩn | PASS |
| 4 | Thiếu `type` | 400 | Xử lý chuẩn | PASS |
| 5 | Thiếu `householdId` | 400 | Xử lý chuẩn | PASS |
| 6 | Thiếu `licensePlate` | 400 | Xử lý chuẩn | PASS |
| 9 | **Tìm kiếm biển số (Partial)** | iLike search | Xử lý chuẩn | **PASS** ✅ |
| 10 | Cập nhật xe không tồn tại | 404 | Xử lý chuẩn | PASS |
| 12 | **Biển số > 20 ký tự** | Báo lỗi "quá dài" | Xử lý chuẩn | **PASS** ✅ |
| 13 | **Loại xe không hợp lệ** | Báo lỗi (Enum check) | Xử lý chuẩn | **PASS** ✅ |
| 15 | **XSS trong màu xe** | Sanitize sạch | Xử lý chuẩn | **PASS** ✅ |
| 16 | **Biển số uppercase và trim** | Chuẩn hóa tự động | Xử lý chuẩn | **PASS** ✅ |
| 17 | **Biển số chứa icon/emoji** | Sanitize (chỉ giữ Alphanumeric & Gạch nối) | Xử lý chuẩn | **PASS** ✅ |
| 18 | IDOR: Cư dân xem xe nhà khác | Chặn | Không xử lý | FAIL |
| 19 | Lấy xe theo householdId không tồn tại | Trả về rỗng | Xử lý chuẩn | PASS |
| 20 | Update loại xe không hợp lệ | 400 | Xử lý chuẩn | PASS |

---
*Ghi chú: Đã lọc từ vehicle_test_report.md dựa trên tiêu chí logic nghiệp vụ và ràng buộc hệ thống.*