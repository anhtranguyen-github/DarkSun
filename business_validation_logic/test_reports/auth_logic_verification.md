# Báo cáo Xác minh: Business Logic & Validation (Authentication)

**Ngày:** 2026-01-04
**Người thực hiện:** Antigravity
**Phiên bản:** 2.1 (Security Update)

## 1. Validation Logic (Kiểm tra dữ liệu)
Các quy tắc kiểm tra dữ liệu đầu vào được tập trung tại `utils/validationUtils.js` và áp dụng cho cả luồng Đăng ký và Tạo User.

| Trường (Field) | Quy tắc Validation (Rule) | Mã nguồn (Source) | Mục đích |
| :--- | :--- | :--- | :--- |
| **Username** | `^[a-zA-Z0-9_]{3,50}$` | `isValidUsername()` | Đảm bảo định dạng chuẩn, tránh ký tự đặc biệt lây nhiễu URL/DB. |
| **Password** | Độ dài tối thiểu 6 ký tự, tối đa 100 | `isValidPassword()` | Đảm bảo độ mạnh mật khẩu cơ bản. (Hash bằng Argon2/Bcrypt sau đó). |
| **Full Name** | 2-100 ký tự, loại bỏ thẻ HTML | `isValidName()`, `sanitizeHtml()` | **Security**: Chống XSS (Cross-site Scripting). |
| **Email** | Regex chuẩn email (nếu có) | `isValidEmail()` | Đảm bảo liên lạc được. |
| **Role ID** | Phải tồn tại trong DB | `Role.findByPk(roleId)` | Đảm bảo tính toàn vẹn dữ liệu. |

## 2. Business Logic (Nghiệp vụ Xử lý)

### A. Quy trình Đăng ký Công khai (Public Registration)
*Áp dụng tại controller: `authController.register`*

1.  **Check Duplicate**: Kiểm tra `username` có tồn tại chưa. Nếu có -> Trả về 400.
2.  **Role Restriction (QUAN TRỌNG)**:
    *   Hệ thống kiểm tra tên của Role được yêu cầu.
    *   Nếu Role **KHÔNG PHẢI** là `resident` -> Trả về **403 Forbidden**.
    *   *Ngăn chặn hacker dùng tool gửi request đăng ký Admin/Manager.*
3.  **Auto Role Selection**: Frontend tự động ẩn lựa chọn Role và mặc định chọn `Resident`.

### B. Quy trình Quản trị viên tạo Tài khoản (Admin Provisioning)
*Áp dụng tại controller: `userController.createUser`*

1.  **Full Access Control**:
    *   API (`POST /api/users`) được bảo vệ bởi middleware `authorize('admin')`.
    *   Chỉ user có quyền Admin mới gọi được API này.
2.  **Flexible Role Assignment**:
    *   Admin có thể gán **BẤT KỲ** role hợp lệ nào (Manager, Accountant, Deputy...) cho user mới.
3.  **Validate Input**: Vẫn áp dụng các rule validation (username, password...) như đăng ký thường.
4.  **Auto Activate**: Tài khoản do Admin tạo có trạng thái `active` ngay lập tức (bỏ qua bước xác minh nếu có).

## 3. Kết luận
Hệ thống Validation và Business Logic cho module Authentication đã được kiện toàn:
- **Chặt chẽ** về dữ liệu đầu vào (Validation).
- **An toàn** về phân quyền (Security Business Logic).
- **Linh hoạt** cho quản trị viên (Admin Logic).
