# Báo cáo Kiểm thử: Quản lý Phương tiện (Vehicle)

**Cập nhật:** 2026-01-04 | **Phiên bản:** 2.2

### Chi tiết kịch bản kiểm thử

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Đăng ký xe hợp lệ | Lưu thành công | Xử lý chuẩn | PASS |
| 2 | Trùng biển số | 409 "Biển số đã tồn tại" | Xử lý chuẩn | PASS |
| 3 | Hộ khẩu không tồn tại | 404 | Xử lý chuẩn | PASS |
| 4 | Thiếu `type` | 400 | Xử lý chuẩn | PASS |
| 5 | Thiếu `householdId` | 400 | Xử lý chuẩn | PASS |
| 6 | Thiếu `licensePlate` | 400 | Xử lý chuẩn | PASS |
| 7 | Lọc theo XeMay | Đúng kết quả | Xử lý chuẩn | PASS |
| 8 | Lọc theo Oto | Đúng kết quả | Xử lý chuẩn | PASS |
| 9 | **Tìm kiếm biển số (Partial)** | iLike search | Xử lý chuẩn | **PASS** ✅ |
| 10 | Cập nhật xe không tồn tại | 404 | Xử lý chuẩn | PASS |
| 11 | Xóa xe thành công | Xóa | Xử lý chuẩn | PASS |
| 12 | **Biển số > 20 ký tự** | Báo lỗi "quá dài" | Xử lý chuẩn | **PASS** ✅ |
| 13 | **Loại xe không hợp lệ** | Báo lỗi (Enum check) | Xử lý chuẩn | **PASS** ✅ |
| 14 | Loại xe "XeDapDien" | Đăng ký thành công | Xử lý chuẩn | PASS |
| 15 | **XSS trong màu xe** | Sanitize sạch | Xử lý chuẩn | **PASS** ✅ |
| 16 | **Biển số uppercase và trim** | Chuẩn hóa tự động | Xử lý chuẩn | **PASS** ✅ |
| 17 | **Biển số chứa icon/emoji** | Sanitize (chỉ giữ Alphanumeric & Gạch nối) | Xử lý chuẩn | **PASS** ✅ |
| 18 | IDOR: Cư dân xem xe nhà khác | Chặn | Không xử lý | FAIL |
| 19 | Lấy xe theo householdId không tồn tại | Trả về rỗng | Xử lý chuẩn | PASS |
| 20 | Update loại xe không hợp lệ | 400 | Xử lý chuẩn | PASS |

---

### Tổng kết: 19 PASS | 1 FAIL

**Các validation đã hoạt động:**
- ✅ License plate length (max 20)
- ✅ Vehicle type enum (XeMay/Oto/XeDapDien)
- ✅ Color XSS sanitization
- ✅ **Strict license plate sanitization (Uppercase + Alphanumeric only)**
- ✅ Fuzzy license plate search (iLike)
