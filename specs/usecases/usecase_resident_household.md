# Resident & Household Management Use Cases

```mermaid
graph LR
    %% Actors
    Manager["👤 Tổ trưởng (Manager)"]
    Deputy["👤 Tổ phó (Deputy)"]
    Admin["👤 Quản trị viên (Admin)"]
    Resident["👤 Cư dân (Resident)"]

    %% System
    subgraph Module ["Module Quản lý Cư dân & Hộ khẩu"]
        direction TB
        UC_ViewHouse(["Xem danh sách Hộ khẩu"])
        UC_CreateHouse(["Tạo Hộ khẩu mới"])
        UC_EditHouse(["Sửa thông tin Hộ khẩu"])
        UC_ChangeOwner(["Thay đổi Chủ hộ"])
        UC_DeleteHouse(["Xóa Hộ khẩu"])
        
        UC_AddResident(["Thêm Nhân khẩu vào Hộ"])
        UC_EditResident(["Sửa thông tin Nhân khẩu"])
        UC_DeleteResident(["Xóa Nhân khẩu (Chuyển đi)"])
        UC_SearchResident(["Tìm kiếm Cư dân"])
        
        UC_TempStay(["Đăng ký Tạm trú / Tạm vắng"])
        UC_ManageVehicle(["Quản lý Phương tiện"])
        
        UC_ViewMyHouse(["Xem thông tin Hộ mình"])
    end

    %% Relationships - Deputy (Read-Only focus)
    Deputy --> UC_ViewHouse
    Deputy --> UC_SearchResident
    Deputy --> UC_TempStay
    Deputy --> UC_ManageVehicle

    %% Relationships - Manager (Full Control)
    Manager --> UC_ViewHouse
    Manager --> UC_SearchResident
    Manager --> UC_CreateHouse
    Manager --> UC_EditHouse
    Manager --> UC_ChangeOwner
    Manager --> UC_DeleteHouse
    Manager --> UC_AddResident
    Manager --> UC_EditResident
    Manager --> UC_DeleteResident
    Manager --> UC_TempStay
    Manager --> UC_ManageVehicle

    %% Relationships - Admin (Management)
    Admin --> UC_ViewHouse
    Admin --> UC_SearchResident
    Admin --> UC_CreateHouse
    Admin --> UC_EditHouse
    Admin --> UC_ChangeOwner
    Admin --> UC_DeleteHouse
    Admin --> UC_AddResident
    Admin --> UC_EditResident
    Admin --> UC_DeleteResident
    
    %% Relationships - Resident
    Resident --> UC_ViewMyHouse
```

## Chi tiết Use Case (Phân rã)

### 1. Quản lý Hộ khẩu (Household Management)
* **Xem danh sách**: Tất cả cán bộ có quyền truy cập module.
* **Tạo mới**: Yêu cầu mã hộ khẩu duy nhất, địa chỉ, và diện tích. 
* **Thay đổi Chủ hộ**: Hệ thống tự động cập nhật quan hệ "Chủ hộ" cho nhân khẩu được chọn và hủy trạng thái chủ hộ cũ.
* **Xóa Hộ khẩu**: Chỉ được thực hiện khi hộ không còn nhân khẩu đang cư trú.

### 2. Quản lý Nhân khẩu (Resident Management)
* **Thêm mới**: Có thể thêm từ "Khai báo nhân khẩu" (Manager/Admin) hoặc từ "Đăng ký cư dân" (Public).
* **Tạm trú/Tạm vắng**: 
    - Đăng ký ngày bắt đầu, ngày kết thúc và lý do.
    - Hệ thống đánh dấu trạng thái đặc biệt cho nhân khẩu.
* **Xóa Nhân khẩu**: Thực hiện xóa mềm (status = 'deleted') để lưu trữ lịch sử cư trú.

### 3. Quản lý Phương tiện (Vehicle Management)
* Liên kết trực tiếp với mã hộ khẩu.
* Phân loại: **Ô tô** và **Xe máy** để tính phí gửi xe tương ứng.

