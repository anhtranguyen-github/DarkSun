# Đặc tả Chi tiết Cơ sở Dữ liệu - Phân hệ IAM

Phân hệ này quản lý Danh tính (Identity), Phân quyền (Access Management) của người dùng trong hệ thống.

## 1. Bảng `users` (Người dùng)
Lưu trữ thông tin tài khoản truy cập hệ thống.

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng (Auto-increment) |
| **username** | Varchar(255) | 255 ký tự | NOT NULL, UNIQUE | Văn bản | Tên đăng nhập |
| **password** | Varchar(255) | 255 ký tự | NOT NULL | Văn bản (Hash) | Đã mã hóa BCRYPT |
| **full_name** | Varchar(255) | 255 ký tự | NOT NULL | Văn bản (Unicode) | Họ và tên đầy đủ |
| email | Varchar(255) | 255 ký tự | UNIQUE | Văn bản (Email) | Định dạng email chuẩn |
| phone_number | Varchar(20) | 20 ký tự | | Văn bản | Số điện thoại liên lạc |
| avatar_url | Text | | | Văn bản (URL) | Đường dẫn ảnh đại diện |
| status | Varchar(20) | 20 ký tự | DEFAULT 'active' | Văn bản | Trạng thái tài khoản |
| household_id | Int | | Khoá ngoại | Số nguyên dương | Tham chiếu đến bảng households |
| created_at | Timestamp | | NOT NULL | Ngày giờ | Thời gian tạo tài khoản |
| updated_at | Timestamp | | NOT NULL | Ngày giờ | Thời gian cập nhật gần nhất |

## 2. Bảng `roles` (Vai trò)
Định nghĩa các vai trò trong hệ thống (Vd: Admin, Manager, Resident).

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **name** | Varchar(255) | 255 ký tự | NOT NULL, UNIQUE | Văn bản | Tên vai trò (định danh hệ thống) |
| display_name | Varchar(255) | 255 ký tự | | Văn bản (Unicode) | Tên hiển thị thân thiện |
| description | Text | | | Văn bản | Mô tả chức năng vai trò |
| created_at | Timestamp | | | Ngày giờ | |
| updated_at | Timestamp | | | Ngày giờ | |

## 3. Bảng `permissions` (Quyền hạn)
Lưu trữ danh sách các hành động có thể thực hiện (Vd: view_resident, delete_household).

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **code** | Varchar(50) | 50 ký tự | NOT NULL, UNIQUE | Văn bản | Mã quyền (Vd: 'user_create') |
| **name** | Varchar(100) | 100 ký tự | NOT NULL | Văn bản (Unicode) | Tên mô tả quyền |
| group_name | Varchar(50) | 50 ký tự | | Văn bản | Nhóm các quyền liên quan |
| description | Text | | | Văn bản | Chi tiết về quyền hạn |

## 4. Bảng `user_roles` (Bảng trung gian Gán vai trò)

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **user_id** | Int | | Khoá chính, Khoá ngoại | Số nguyên dương | Tham chiếu đến bảng users |
| **role_id** | Int | | Khoá chính, Khoá ngoại | Số nguyên dương | Tham chiếu đến bảng roles |

## 5. Bảng `role_permissions` (Bảng trung gian Gán quyền)

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **role_id** | Int | | Khoá chính, Khoá ngoại | Số nguyên dương | Tham chiếu đến bảng roles |
| **permission_id**| Int | | Khoá chính, Khoá ngoại | Số nguyên dương | Tham chiếu đến bảng permissions |
