# Business Validation: Household

### Scenarios lọc chọn (Logic & Validation)

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 2 | Trùng householdCode | 409 | Xử lý chuẩn | PASS |
| 4 | Trùng CCCD chủ hộ | 409 | Xử lý chuẩn | PASS |
| 5 | Thay đổi chủ hộ | Reset người cũ thành "Thành viên" | Xử lý chuẩn | PASS |
| 6 | area âm | Báo lỗi | Xử lý chuẩn | PASS |
| 7 | area = 0 | Báo lỗi | Xử lý chuẩn | PASS |
| 8 | area = "abc" | Báo lỗi | Xử lý chuẩn | PASS |
| 9 | XSS trong địa chỉ | Sanitize | Không xử lý | FAIL |
| 10 | IDOR xem hộ khẩu khác | Chặn | Không xử lý | FAIL |
| 11 | **Đổi chủ hộ không thuộc hộ** | Chặn 400 | Xử lý chuẩn | **PASS** ✅ |
| 14 | Thiếu thông tin chủ hộ | 400 | Xử lý chuẩn | PASS |
| 15 | **Xóa hộ còn nhân khẩu** | Chặn xóa | Xử lý chuẩn | **PASS** ✅ |
| 16 | **Xóa hộ còn xe** | Chặn xóa | Xử lý chuẩn | **PASS** ✅ |
| 17 | **Xóa hộ còn hóa đơn unpaid** | Chặn xóa | Xử lý chuẩn | **PASS** ✅ |
| 18 | **Xóa hộ khi chỉ còn hóa đơn PAID** | Cho phép xóa | Xử lý chuẩn | **PASS** ✅ |
| 19 | Transaction rollback khi lỗi Resident | Không tạo hộ | Xử lý chuẩn | PASS |
| 20 | Update householdCode trùng | 409 | Xử lý chuẩn | PASS |
| 21 | SQL Injection filter | Chặn | Xử lý chuẩn | PASS |
| 22 | area = 0.5 (số thập phân) | Chấp nhận | Xử lý chuẩn | PASS |
| 23 | **Tạo hộ thiếu Phường/Quận** | Báo lỗi 400 | Xử lý chuẩn | **PASS** ✅ |

---
*Ghi chú: Đã lọc từ household_test_report.md dựa trên tiêu chí logic nghiệp vụ và ràng buộc hệ thống.*