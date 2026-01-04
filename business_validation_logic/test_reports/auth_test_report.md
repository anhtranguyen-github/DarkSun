# Báo cáo Kiểm thử & Xác minh: Đăng nhập & Xác thực (Auth)

**Cập nhật:** 2026-01-04 | **Phiên bản:** 2.3 (Unified Security & Auth Report)

## 1. Quy tắc Xác thực & Bảo mật (Validation Rules)

| Trường (Field) | Quy tắc Validation (Rule) | Mã nguồn (Source) | Mục đích |
| :--- | :--- | :--- | :--- |
| **Username** | `^[a-zA-Z0-9_]{3,50}$` | `isValidUsername()` | Định dạng chuẩn, chặn ký tự đặc biệt. |
| **Password** | Độ dài 6-100 ký tự | `isValidPassword()` | Đảm bảo độ mạnh cơ bản (Bcrypt). |
| **Full Name** | 2-100 ký tự, Sanitize thẻ HTML | `isValidName()` | **Security**: Chống XSS. |
| **Email** | Regex chuẩn email | `isValidEmail()` | Đảm bảo tính chính xác. |
| **Role ID** | Phải tồn tại trong DB | `Role.findByPk()` | Đảm bảo toàn vẹn RBAC. |

---

## 2. Luồng Nghiệp vụ Duy nhất (Unified Business Logic)

*Hệ thống áp dụng các kiểm soát nghiêm ngặt tại Controller để đảm bảo an toàn:*
1. **Public Registration**: Chỉ chấp nhận `role: resident`. Mọi cố gắng đăng ký quyền cao hơn (Manager/Admin) đều bị chặn (403).
2. **Admin Provisioning**: Chỉ Admin được gọi `POST /api/users` để tạo nhân viên với các vai trò tùy chọn.
3. **Data Integrity**: Sanitize `fullName` để triệt tiêu script độc hại (XSS) và chặn `username` trùng lặp (400).

---

## 3. BẢNG KIỂM THỬ TỔNG HỢP (UNIFIED TEST TABLE)

| STT | Phân loại | Kịch bản kiểm thử (Test Scenario) | Input | Kết quả | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
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
| 16 | Integrity | Token Payload | Kiểm tra data trong JWT | Chỉ chứa id, user, roles | PASS |
| 17 | Auth | Token hết hạn / Sai signature | JWT không hợp lệ | Trả về 401 | PASS |
| 18 | Security | **Type Juggling** (Username/Pass) | Input dạng Array/Object | Chặn, báo lỗi định dạng | PASS |
| 19 | Security | Token cũ của user đã bị khóa | Dùng token cũ truy cập | Chặn phía Middleware | FAIL |
| 20 | Infrastructure | Brute-force protection | 100 requests/s | Rate Limit activation | FAIL |

---

## 4. Tổng kết & Kết luận

**Kết quả:** 18 PASS | 2 FAIL

**Ghi chú kỹ thuật:**
- **Vá lỗi Privilege Escalation**: Đã hardcode kiểm tra Role trong luồng public registration.
- **Vá lỗ hổng XSS**: Đã tích hợp thư viện sanitize cho toàn bộ các trường nhập liệu chuỗi.
- **Tiếp tục theo dõi**: Cần cấu hình thêm Redis Blacklist để invalidate token ngay lập tức sau khi khóa tài khoản (STT 19).

---
*Ghi chú: Báo cáo này gộp toàn bộ các kịch bản từ Auth Logic và Registration Security.*
