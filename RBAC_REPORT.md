# Báo cáo Hệ thống Phân quyền (Role-Based Access Control - RBAC)
**Dự án:** Quản lý Khu dân cư DarkSun (BlueMoon)

## 1. Giới thiệu
Hệ thống sử dụng mô hình RBAC để quản lý quyền truy cập. Quyền hạn không được gán trực tiếp cho người dùng mà thông qua các **Vai trò (Roles)**. Mỗi vai trò chứa một tập hợp các **Quyền (Permissions)** cụ thể.

## 2. Danh sách các Vai trò (Roles)
Hệ thống định nghĩa 5 vai trò chính:

| Vai trò | Tên hiển thị | Mô tả |
| :--- | :--- | :--- |
| **admin** | Quản Trị Viên | Toàn quyền điều hành hệ thống, quản lý người dùng và cấu hình cấp cao. |
| **manager** | Tổ Trưởng | Quản lý nhân khẩu, hộ khẩu, duyệt tạm trú/vắng và thẩm định các báo cáo. |
| **deputy** | Tổ Phó | Hỗ trợ quản lý, có quyền tra cứu cư dân và xem các số liệu báo cáo (chỉ đọc). |
| **accountant** | Kế Toán | Quản lý tài chính: cấu hình phí, lập hóa đơn, thu tiền và báo cáo doanh thu. |
| **resident** | Cư Dân | Truy cập cổng thông tin cá nhân, xem hóa đơn và lịch sử đóng góp của hộ gia đình mình. |

## 3. Cấu trúc Quyền (Permissions)
Các quyền được nhóm theo chức năng để dễ quản lý:
- **Nhân khẩu (nk):** `view`, `create`, `update`, `delete`, `move`.
- **Hộ khẩu (hk):** `view`, `create`, `update`, `delete`, `change_owner`, `tach`.
- **Tài chính (phi/hd):** `view`, `config`, `create_period`, `generate_invoice`, `collect_money`.
- **Thống kê (tk):** `nhan_khau`, `ho_khau`, `thu_phi`, `export`.
- **Cá nhân (my):** `view_profile`, `view_invoices`, `view_payments`.

## 4. Triển khai đặc biệt cho UC11 "Xem báo cáo/ thống kê"
Theo yêu cầu nghiệp vụ mới từ Use Case UC11, quyền truy cập được siết chặt như sau:

### 4.1. Phân quyền tại Backend (API Security)
Các endpoint thống kê tại `/api/statistics/fees` được bảo vệ bởi middleware xác thực:
```javascript
// statisticsRoutes.js
router.use(authorize('admin', 'manager', 'deputy', 'accountant'));
```

### 4.2. Phân quyền tại Frontend (UI/UX)
- **Menu Sidebar:** Chỉ hiển thị mục "Thống kê Thu phí" cho người dùng có vai trò phù hợp để tránh làm rối giao diện của Cư dân.
- **Route Guard:** Sử dụng `RoleBasedGuard` để ngăn chặn truy cập trực tiếp qua URL đối với những người không có quyền.

## 5. Cơ chế Kỹ thuật

### 5.1. Database (Sequelize)
Sử dụng 3 bảng chính:
1. `roles`: Lưu danh sách vai trò.
2. `permissions`: Lưu danh sách các hành động được phép.
3. `role_permissions`: Bảng trung gian liên kết n-n giữa vai trò và quyền.

### 5.2. Middleware (Node.js)
- `protect`: Giải mã JWT token để xác định danh tính người dùng.
- `authorize`: Kiểm tra mảng `roles` trong token của người dùng có khớp với yêu cầu của API hay không.

### 5.3. React Context & Hooks
Sử dụng `AuthContext` để lưu trữ thông tin role của người dùng hiện tại, hỗ trợ render giao diện theo điều kiện (`Conditional Rendering`).

## 6. Kết luận
Hệ thống RBAC hiện tại đã đảm bảo được tính an toàn thông tin, tách biệt rõ ràng trách nhiệm giữa bộ phận quản trị căn hộ, bộ phận kế toán và cư dân. Việc thêm mới UC11 đã được tích hợp trơn tru vào khung bảo mật có sẵn.

---
*Ngày lập báo cáo: 11/01/2026*
*Người thực hiện: Antigravity AI Assistant*
