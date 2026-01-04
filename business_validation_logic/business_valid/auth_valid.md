# Business Validation: Auth

### Scenarios lọc chọn (Logic & Validation)

| STT | Phân loại | Kịch bản kiểm thử (Test Scenario) | Input | Kết quả | Trạng thái |
| --- | --- | --- | --- | --- |
| 1 | Auth | Đăng nhập hợp lệ | `username`, `password` đúng | Thành công (200) | PASS |
| 2 | Registration | **Đăng ký Cư Dân hợp lệ** | `role: resident`, data chuẩn | Thành công (201) | **PASS** ✅ |
| 3 | Security | **Leo thang đặc quyền** (Escalation) | Đăng ký với `role: manager/admin` | **Chặn 403 Forbidden** | **PASS** ✅ |
| 4 | Admin | **Admin tạo Manager** | `auth: admin`, `role: manager` | Thành công (201) | **PASS** ✅ |
| 5 | Admin | **Admin tạo Accountant** | `auth: admin`, `role: accountant` | Thành công (201) | **PASS** ✅ |
| 6 | Validation | Username chứa ký tự lạ | `username: hacker@123` | Báo lỗi định dạng | **PASS** ✅ |
| 7 | Validation | Username quá ngắn/dài | <3 hoặc >50 ký tự | Chặn, báo lỗi | **PASS** ✅ |
| 8 | Validation | Password quá ngắn | < 6 ký tự | Chặn, báo lỗi | PASS |
| 9 | Validation | **XSS Injection** trong Họ tên | `fullName: <script>alert(1)</script>` | **Sanitize sạch mã độc** | **PASS** ✅ |
| 10 | Logic | **Username đã tồn tại** | Đăng ký tên đã có trong DB | Trả về 400 | **PASS** ✅ |
| 11 | Validation | Email sai định dạng | `email: abc#xyz.com` | Báo lỗi 400 | PASS |
| 12 | Security | Tài khoản bị khóa (`locked`) | Đăng nhập tài khoản bị khóa | Báo lỗi "bị khóa" | PASS |
| 13 | Security | Tài khoản đã xóa (`deleted`) | Đăng nhập tài khoản soft-delete | Báo lỗi 404/401 | **PASS** ✅ |
| 14 | Auth | Sai mật khẩu / Không tồn tại | Thông tin không khớp | Trả về 401 | PASS |
| 15 | Security | SQL Injection trong Login | `' OR '1'='1` | Chặn (Sequelize ORM) | PASS |
| 17 | Auth | Token hết hạn / Sai signature | JWT không hợp lệ | Trả về 401 | PASS |
| 18 | Security | **Type Juggling** (Username/Pass) | Input dạng Array/Object | Chặn, báo lỗi định dạng | PASS |
| 19 | Security | Token cũ của user đã bị khóa | Dùng token cũ truy cập | Chặn phía Middleware | FAIL |
| 20 | Infrastructure | Brute-force protection | 100 requests/s | Rate Limit activation | FAIL |

---
*Ghi chú: Đã lọc từ auth_test_report.md dựa trên tiêu chí logic nghiệp vụ và ràng buộc hệ thống.*