# Business Validation: Resident

### Scenarios lọc chọn (Logic & Validation)

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Thêm nhân khẩu hợp lệ | Lưu thành công | Xử lý chuẩn | PASS |
| 2 | Trùng số CCCD | 409 | Xử lý chuẩn | PASS |
| 3 | Xóa nhân khẩu là Chủ hộ | Chặn xóa | Xử lý chuẩn | PASS |
| 5 | IDOR xem Cư dân khác | Chặn 403 | Không xử lý | FAIL |
| 7 | **Tên > 100 ký tự** | Chặn | Xử lý chuẩn | **PASS** ✅ |
| 10 | ID Card 10 ký tự | Báo lỗi (Phải 9 hoặc 12) | Xử lý chuẩn | PASS |
| 11 | XSS trong tên | Sanitize | Xử lý chuẩn | **PASS** ✅ |
| 13 | Xóa ID không tồn tại | 404 | Xử lý chuẩn | PASS |
| 14 | Thiếu fullName | 400 | Xử lý chuẩn | PASS |
| 15 | Thiếu dateOfBirth | 400 | Xử lý chuẩn | PASS |
| 16 | Thiếu gender | 400 | Xử lý chuẩn | PASS |
| 17 | householdId không tồn tại | 404 | Xử lý chuẩn | PASS |
| 18 | **Giới tính giá trị lạ** | Báo lỗi | Xử lý chuẩn | **PASS** ✅ |
| 20 | **Ngày sinh > 150 tuổi** | Chặn | Xử lý chuẩn | **PASS** ✅ |
| 21 | Update CCCD trùng | 409 | Xử lý chuẩn | PASS |
| 23 | **alias, ethnicity, religion > 50 ký tự** | Chặn | Xử lý chuẩn | **PASS** ✅ |
| 24 | **XSS Injection trong nativePlace** | Sanitize | Xử lý chuẩn | **PASS** ✅ |
| 25 | **Tên có tiền tố/hậu tố spaces** | Trim tự động | Xử lý chuẩn | **PASS** ✅ |

---
*Ghi chú: Đã lọc từ resident_test_report.md dựa trên tiêu chí logic nghiệp vụ và ràng buộc hệ thống.*