# Báo cáo Kiểm thử: Tạm trú & Tạm vắng (Temp Residence)

**Cập nhật:** 2026-01-04 | **Phiên bản:** 2.2

### Chi tiết kịch bản kiểm thử

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Khai báo tạm trú hợp lệ | Lưu thành công | Xử lý chuẩn | PASS |
| 2 | Khai báo tạm vắng hợp lệ | Lưu thành công | Xử lý chuẩn | PASS |
| 3 | Cư dân không tồn tại | 404 | Xử lý chuẩn | PASS |
| 4 | Thiếu residentId | 400 | Xử lý chuẩn | PASS |
| 5 | Thiếu type | 400 | Xử lý chuẩn | PASS |
| 6 | Thiếu startDate | 400 | Xử lý chuẩn | PASS |
| 7 | Trùng permitCode | 409 | Xử lý chuẩn | PASS |
| 8 | **endDate trước startDate** | Báo lỗi 400 | Xử lý chuẩn | **PASS** ✅ |
| 9 | address trống | Báo lỗi | Xử lý chuẩn | PASS |
| 10 | address < 5 ký tự | Báo lỗi | Xử lý chuẩn | PASS |
| 11 | reason > 500 ký tự | Báo lỗi | Xử lý chuẩn | PASS |
| 12 | **Tìm kiếm theo tên (Fuzzy)** | Đúng kết quả (iLike) | Xử lý chuẩn | **PASS** ✅ |
| 13 | Lọc theo type | Đúng | Xử lý chuẩn | PASS |
| 14 | **permitCode chứa ký tự lạ** | Sanitize (chỉ alphanumeric) | Xử lý chuẩn | **PASS** ✅ |
| 15 | IDOR xem người khác | Chặn | Không xử lý | FAIL |
| 16 | **type không hợp lệ** | Báo lỗi (Enum check) | Xử lý chuẩn | **PASS** ✅ |
| 17 | address chứa XSS | Sanitize | Không xử lý | FAIL |
| 18 | reason chứa XSS | Sanitize | Không xử lý | FAIL |
| 19 | permitCode null | Chấp nhận | Xử lý chuẩn | PASS |
| 20 | endDate null | Chấp nhận | Xử lý chuẩn | PASS |

---

### Tổng kết: 17 PASS | 3 FAIL

**Các lỗi đã sửa trong phiên bản này:**
- ✅ Type enum validation (tam_tru, tam_vang)
- ✅ Date range validation (endDate >= startDate)
- ✅ permitCode sanitization
- ✅ Resident Name fuzzy search coupling
- ✅ Address length validation (min 5)
