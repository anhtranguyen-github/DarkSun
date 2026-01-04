# Báo cáo Kiểm thử: Quy trình Đăng ký & Bảo mật (Registration Security)

**Ngày:** 2026-01-04
**Người thực hiện:** Antigravity
**Phiên bản:** 2.1 (Role Standardization Update)

## 1. Tổng quan
Kiểm thử tập trung vào các thay đổi bảo mật mới trong quy trình đăng ký tài khoản, đảm bảo ngăn chặn leo thang đặc quyền (Privilege Escalation) và xác minh tính năng tạo người dùng của Admin.

## 2. Kịch bản kiểm thử (Test Scenarios)

### Kịch bản A: Đăng ký Công khai (Public Registration)
*Mục tiêu: Đảm bảo người dùng thông thường chỉ có thể đăng ký tài khoản Cư Dân.*

| ID | Test Case | Dữ liệu đầu vào | Thao tác | Kết quả Mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **REG-01** | Đăng ký Cư Dân hợp lệ | `username: new_res`, `role: resident` | Submit form Đăng ký | **Thành công (201)**. User có role `resident`. | ✅ PASS |
| **REG-02** | Cố tình đăng ký role Quản lý (IDOR/Escalation) | `username: hacker`, `role: manager` (Inject API) | Gửi request API trực tiếp | **Thất bại (403 Forbidden)**. Server chặn và báo lỗi permission. | ✅ PASS |
| **REG-03** | Đăng ký trùng tên | `username: existing_user` | Submit form | **Thất bại (400)**. Báo lỗi tên tồn tại. | ✅ PASS |

### Kịch bản B: Admin Tạo tài khoản (Admin Provisioning)
*Mục tiêu: Đảm bảo Admin có thể tạo tài khoản nhân viên (Manager, Accountant) thông qua Dashboard.*

| ID | Test Case | Dữ liệu đầu vào | Thao tác | Kết quả Mong đợi | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ADM-01** | Admin tạo Manager | `auth: admin_token`, `role: manager` | Dùng chức năng "Thêm tài khoản" | **Thành công (201)**. User mới có role `manager`. | ✅ PASS |
| **ADM-02** | Admin tạo Accountant | `auth: admin_token`, `role: accountant` | Dùng chức năng "Thêm tài khoản" | **Thành công (201)**. User mới có role `accountant`. | ✅ PASS |
| **ADM-03** | Validate dữ liệu thiếu | `username: <empty>` | Submit form | **Thất bại (400)**. Báo lỗi thiếu thông tin. | ✅ PASS |

## 3. Ghi chú Kỹ thuật
- **Backend Protection**: Controller `authController.register` đã được hardcode để chặn mọi `roleId` khác với Resident nếu gọi qua public API.
- **Frontend Logic**: Giao diện Đăng ký đã ẩn dropdown chọn Role, tự động gán ID của Resident.
- **Admin API**: Endpoint `POST /api/users` được bảo vệ bởi middleware `authorize('admin')`.

## 4. Kết luận
Hệ thống đã vá thành công lỗ hổng leo thang đặc quyền trong quá trình đăng ký. Các quy trình tạo tài khoản nhân viên được chuyển về luồng quản trị tập trung an toàn.
