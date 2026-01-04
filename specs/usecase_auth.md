# Auth & User Management Use Cases

```mermaid
usecaseDiagram
    actor "Khách (Guest)" as Guest
    actor "Người dùng đã đăng nhập" as AuthenticatedUser
    actor "Quản trị viên (Admin)" as Admin

    package "Module Xác thực & Quản lý Người dùng" {
        usecase "Đăng nhập" as UC_Login
        usecase "Đăng ký tài khoản" as UC_Register
        usecase "Đổi mật khẩu" as UC_ChangePass
        usecase "Cập nhật Profile" as UC_UpdateProfile
        usecase "Xem danh sách Role" as UC_ViewRoles
        usecase "Quản lý Người dùng (CRUD)" as UC_CRUD_User
        usecase "Gán vai trò (Role)" as UC_AssignRole
        usecase "Khóa / Mở khóa tài khoản" as UC_LockUser
        usecase "Xóa tài khoản" as UC_DeleteUser
    }

    Guest --> UC_Login
    Guest --> UC_Register
    Guest --> UC_ViewRoles

    AuthenticatedUser <|-- Admin
    AuthenticatedUser --> UC_ChangePass
    AuthenticatedUser --> UC_UpdateProfile

    Admin --> UC_CRUD_User
    Admin --> UC_AssignRole
    Admin --> UC_LockUser
    Admin --> UC_DeleteUser
```
