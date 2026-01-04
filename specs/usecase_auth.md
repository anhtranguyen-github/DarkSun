# Auth & User Management Use Cases

```mermaid
graph LR
    %% Actors
    AuthenticatedUser["👤 Người dùng đã đăng nhập"]
    Admin["👤 Quản trị viên (Admin)"]

    %% System
    subgraph Module ["Module Xác thực & Quản lý Người dùng"]
        direction TB
        UC_Login(["🔐 Đăng nhập"])
        UC_Register(["📝 Đăng ký tài khoản"])
        UC_ChangePass(["🔑 Đổi mật khẩu"])
        UC_UpdateProfile(["📝 Cập nhật Profile"])
        UC_ViewRoles(["👀 Xem danh sách Role"])
        UC_CRUD_User(["👥 Quản lý Người dùng (CRUD)"])
        UC_AssignRole(["🏷️ Gán vai trò (Role)"])
        UC_DeleteUser(["🗑️ Xóa tài khoản"])
    end

    %% Relationships

    %% Inheritance
    Admin -.-> AuthenticatedUser
    
    AuthenticatedUser --> UC_ChangePass
    AuthenticatedUser --> UC_UpdateProfile

    Admin --> UC_CRUD_User
    Admin --> UC_AssignRole
    Admin --> UC_DeleteUser
```
