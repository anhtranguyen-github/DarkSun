# Auth & User Management Use Cases

```mermaid
graph LR
    %% Actors
    Resident["👤 Cư dân (Resident)"]
    Manager["👤 Tổ trưởng (Manager)"]
    Deputy["👤 Tổ phó (Deputy)"]
    Accountant["👤 Kế toán (Accountant)"]
    Admin["👤 Quản trị viên (Admin)"]
    
    %% Abstract Actor
    AuthenticatedUser["👤 Người dùng đã đăng nhập"]

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

    %% Relationships - Public
    Resident --> UC_Login
    Resident --> UC_Register
    Resident --> UC_ViewRoles
    
    Manager --> UC_Login
    Deputy --> UC_Login
    Accountant --> UC_Login
    Admin --> UC_Login

    %% Relationships - Authenticated functionalities
    Resident --> UC_ChangePass
    Resident --> UC_UpdateProfile
    Manager --> UC_ChangePass
    Manager --> UC_UpdateProfile
    Deputy --> UC_ChangePass
    Deputy --> UC_UpdateProfile
    Accountant --> UC_ChangePass
    Accountant --> UC_UpdateProfile
    Admin --> UC_ChangePass
    Admin --> UC_UpdateProfile

    %% Relationships - Management
    Manager --> UC_CRUD_User
    Manager --> UC_AssignRole
    Manager --> UC_DeleteUser
    
    Admin --> UC_CRUD_User
    Admin --> UC_AssignRole
    Admin --> UC_DeleteUser
```

## Chi tiết Use Case (Phân rã)

### 1. Quản lý Tài khoản (User Account Management)
* **Tạo tài khoản mới**: 
    - Quản lý có thể tạo tài khoản cho Cư dân hoặc Tổ phó.
    - **Ràng buộc**: Manager KHÔNG THỂ tạo hoặc tác động lên tài khoản Admin.
* **Xóa tài khoản**: Thực hiện "Xóa mềm" (status = 'deleted') để đảm bảo toàn vẹn dữ liệu lịch sử.

### 2. Phân quyền (Role Assignment)
* Gán 1 hoặc nhiều vai trò cho người dùng.
* **Ràng buộc**: Chỉ Admin mới có quyền gán vai trò "Admin". Manager chỉ có thể gán Resident, Deputy, Accountant.

