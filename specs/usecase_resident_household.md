# Resident & Household Management Use Cases

```mermaid
usecaseDiagram
    actor "Tổ trưởng (Manager)" as Manager
    actor "Quản trị viên (Admin)" as Admin
    actor "Cư dân (Resident)" as Resident

    package "Module Quản lý Cư dân & Hộ khẩu" {
        usecase "Xem danh sách Hộ khẩu" as UC_ViewHouse
        usecase "Tạo Hộ khẩu mới" as UC_CreateHouse
        usecase "Sửa thông tin Hộ khẩu" as UC_EditHouse
        usecase "Thay đổi Chủ hộ" as UC_ChangeOwner
        usecase "Xóa Hộ khẩu" as UC_DeleteHouse
        
        usecase "Thêm Nhân khẩu vào Hộ" as UC_AddResident
        usecase "Sửa thông tin Nhân khẩu" as UC_EditResident
        usecase "Xóa Nhân khẩu (Chuyển đi)" as UC_DeleteResident
        usecase "Tìm kiếm Cư dân" as UC_SearchResident
        
        usecase "Đăng ký Tạm trú / Tạm vắng" as UC_TempStay
        usecase "Quản lý Phương tiện" as UC_ManageVehicle
        
        usecase "Xem thông tin Hộ mình" as UC_ViewMyHouse
    }

    Admin --|> Manager
    
    Manager --> UC_ViewHouse
    Manager --> UC_CreateHouse
    Manager --> UC_EditHouse
    Manager --> UC_ChangeOwner
    Manager --> UC_DeleteHouse
    
    Manager --> UC_AddResident
    Manager --> UC_EditResident
    Manager --> UC_DeleteResident
    Manager --> UC_SearchResident
    
    Manager --> UC_TempStay
    Manager --> UC_ManageVehicle

    Resident --> UC_ViewMyHouse
```
