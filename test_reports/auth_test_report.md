# Báo cáo Kiểm thử: Đăng nhập & Xác thực (Auth) - Toàn diện (Final)

### Chi tiết kịch bản kiểm thử (Happy Path + Exceptions + Security + Known Bugs)

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Username/Password hợp lệ | Đăng nhập thành công | Xử lý chuẩn | PASS |
| 2 | Để rỗng trường Username hoặc Password | Thông báo lỗi đăng nhập (400/401) | Xử lý chuẩn | PASS |
| 3 | Mật khẩu sai | Thông báo "Sai tài khoản hoặc mật khẩu" | Xử lý chuẩn | PASS |
| 4 | Password quá ngắn (< 6 ký tự) | Thông báo lỗi độ dài tối thiểu | **Không xử lý** | FAIL |
| 5 | Tài khoản bị khóa (`status: locked`) | Thông báo "Tài khoản bị khóa" | Xử lý chuẩn | PASS |
| 6 | **[BUG-L-01]** Dùng token cũ của tài khoản vừa bị khóa | Chặn truy cập (Check status mỗi request) | **Không xử lý (Vẫn vào được)** | FAIL |
| 7 | Đăng ký: Truyền `roleId: 1` (Admin) | Chặn không cho tự gán quyền Admin | **Không xử lý (Trở thành Admin)** | FAIL |
| 8 | Header Auth: `Bearer` (không có token) | Trả về 401 Unauthorized | **Xử lý sai (Crash 500)** | FAIL |
| 9 | Gửi Password dạng mảng `{"password": ["123"]}` | Báo lỗi định dạng | **Xử lý sai (Crash server)** | FAIL |
| 10 | Header Auth: Token rỗng hoặc chứa ký tự lạ | Trả về 401 | Xử lý chuẩn | PASS |
| 11 | Brute-force: Gửi liên tục 100 request Login/s | Chặn IP hoặc Rate Limit | **Không xử lý (CPU 100%)** | FAIL |
| 12 | SQL Injection: `' OR 1=1 --` | Không bị bypass | Xử lý chuẩn (ORM) | PASS |
| 13 | Login khi server mất kết nối Database | Thông báo lỗi server (500) | Xử lý chuẩn | PASS |
| 14 | Update Profile: Gửi field `roles` trái phép | Chặn Mass Assignment | **Không xử lý (Bị đổi role)** | FAIL |

---
**Kết luận:** Module này cần được gia cố bằng Middleware kiểm tra `user.status` trong mọi request và bổ sung Rate Limiting để chống tấn công DoS.
