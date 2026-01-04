# Overview Use Case Diagram

```mermaid
usecaseDiagram
    actor "Khách (Guest)" as Guest
    actor "Cư dân (Resident)" as Resident
    actor "Tổ trưởng (Manager)" as Manager
    actor "Kế toán (Accountant)" as Accountant
    actor "Quản trị viên (Admin)" as Admin

    package "Hệ thống Quản lý Chung cư BlueMoon" {
        usecase "Đăng nhập / Đăng ký" as UC_Auth
        usecase "Quản lý Thông tin Cá nhân" as UC_Profile
        usecase "Xem Hóa đơn & Phí" as UC_ViewBills
        usecase "Quản lý Hộ khẩu & Nhân khẩu" as UC_ManageHouse
        usecase "Quản lý Phương tiện" as UC_ManageVehicle
        usecase "Quản lý Khoản phí & Đợt thu" as UC_ManageFee
        usecase "Tạo & Thu Hóa đơn" as UC_ManageInvoice
        usecase "Quản lý Tạm trú / Tạm vắng" as UC_ManageTemp
        usecase "Quản lý Người dùng & Phân quyền" as UC_ManageUser
        usecase "Xem Thống kê & Báo cáo" as UC_Stats
    }

    Guest --> UC_Auth
    Resident --> UC_Auth
    Resident --> UC_Profile
    Resident --> UC_ViewBills

    Manager --> UC_Auth
    Manager --> UC_Profile
    Manager --> UC_ManageHouse
    Manager --> UC_ManageVehicle
    Manager --> UC_ManageTemp
    Manager --> UC_ViewBills

    Accountant --> UC_Auth
    Accountant --> UC_Profile
    Accountant --> UC_ManageFee
    Accountant --> UC_ManageInvoice
    Accountant --> UC_Stats

    Admin --> UC_Auth
    Admin --> UC_ManageUser
    Admin --> UC_Stats
    Admin --|> Manager
    Admin --|> Accountant
```
