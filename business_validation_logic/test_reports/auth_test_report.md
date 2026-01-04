# Báo cáo Kiểm thử: Đăng nhập & Xác thực (Auth)

**Cập nhật:** 2026-01-04 | **Phiên bản:** 2.1

### Chi tiết kịch bản kiểm thử

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Username/Password hợp lệ | Đăng nhập thành công | Xử lý chuẩn | PASS |
| 2 | Để rỗng Username | Báo lỗi 400 | Xử lý chuẩn | PASS |
| 3 | Để rỗng Password | Báo lỗi 400 | Xử lý chuẩn | PASS |
| 4 | Mật khẩu sai | Thông báo "không đúng" | Xử lý chuẩn | PASS |
| 5 | Username không tồn tại | Báo lỗi | Xử lý chuẩn | PASS |
| 6 | Password < 6 ký tự | Báo lỗi "6 ký tự" | Xử lý chuẩn | PASS |
| 7 | Tài khoản bị khóa | Báo lỗi "bị khóa" | Xử lý chuẩn | PASS |
| 8 | Token cũ của tài khoản bị khóa | Chặn truy cập | Không xử lý | FAIL |
| 9 | Đăng ký với `roleId: 1` | Chặn Admin | Xử lý chuẩn | PASS |
| 10 | Header `Authorization: Bearer` (thiếu token) | 401 | Xử lý chuẩn | PASS |
| 11 | Password dạng mảng `["123"]` | Báo lỗi định dạng | Xử lý chuẩn | PASS |
| 12 | Username dạng mảng | Báo lỗi định dạng | Xử lý chuẩn | PASS |
| 13 | Token rỗng | 401 | Xử lý chuẩn | PASS |
| 14 | Brute-force 100 requests/s | Rate Limit | Không xử lý | FAIL |
| 15 | SQL Injection | Không bypass | Xử lý chuẩn | PASS |
| 16 | Mass Assignment roles | Chặn | Xử lý chuẩn | PASS |
| 17 | Token hết hạn | 401 | Xử lý chuẩn | PASS |
| 18 | Token sai signature | 401 | Xử lý chuẩn | PASS |
| 19 | Username đã tồn tại | 409 | Xử lý chuẩn | PASS |
| 20 | **Username < 3 ký tự** | Báo lỗi | Xử lý chuẩn | **PASS** ✅ |
| 21 | **Username > 50 ký tự** | Chặn | Xử lý chuẩn | **PASS** ✅ |
| 22 | **Username chứa @#$%** | Báo lỗi "chỉ chứa chữ cái, số và dấu gạch dưới" | Xử lý chuẩn | **PASS** ✅ |
| 23 | **Email không hợp lệ** | Báo lỗi | Xử lý chuẩn | **PASS** ✅ |
| 24 | Password > 100 ký tự | Chặn | Xử lý chuẩn | **PASS** ✅ |
| 25 | Logout và invalidate token | Blacklist | Không xử lý | FAIL |
| 26 | Password hash bcrypt | Không plain text | Xử lý chuẩn | PASS |
| 27 | **fullName chứa XSS** | Sanitize | Xử lý chuẩn | **PASS** ✅ |
| 28 | **fullName 2-100 ký tự** | Validate | Xử lý chuẩn | **PASS** ✅ |
| 29 | Token payload minimal | Chỉ id, username, roles | Xử lý chuẩn | PASS |

---

### Tổng kết: 25 PASS | 4 FAIL

**Các lỗi đã sửa trong phiên bản này:**
- ✅ Username length validation (3-50 chars)
- ✅ **Username special characters validation (chỉ a-zA-Z0-9_)**
- ✅ Email format validation
- ✅ Password length validation (6-100 chars)
- ✅ FullName XSS sanitization
- ✅ FullName length validation (2-100 chars)

