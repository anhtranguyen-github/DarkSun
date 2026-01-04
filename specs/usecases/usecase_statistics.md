# Statistics & Reporting Use Cases

```mermaid
graph LR
    %% Actors
    Manager["👤 Tổ trưởng (Manager)"]
    Deputy["👤 Tổ phó (Deputy)"]
    Accountant["👤 Kế toán (Accountant)"]
    Admin["👤 Quản trị viên (Admin)"]

    %% System
    subgraph Module ["Module Thống kê & Báo cáo"]
        direction TB
        UC_Dashboard(["📊 Xem Dashboard Tổng quan"])
        UC_StatResident(["👥 Thống kê Nhân khẩu"])
        UC_StatTemp(["🛂 Thống kê Tạm trú / Tạm vắng"])
        UC_StatFees(["💰 Thống kê Thu phí (Đã thu / Chưa thu)"])
        UC_Export(["📥 Xuất Báo cáo Excel (Future)"])
    end
    
    %% Relationships - Admin (Full Access)
    Admin --> UC_Dashboard
    Admin --> UC_StatResident
    Admin --> UC_StatTemp
    Admin --> UC_StatFees
    Admin --> UC_Export

    %% Relationships - Manager (Full Access)
    Manager --> UC_Dashboard
    Manager --> UC_StatResident
    Manager --> UC_StatTemp
    Manager --> UC_StatFees
    Manager --> UC_Export

    %% Relationships - Deputy (Broad Access)
    Deputy --> UC_Dashboard
    Deputy --> UC_StatResident
    Deputy --> UC_StatTemp
    Deputy --> UC_StatFees
    Deputy --> UC_Export

    %% Relationships - Accountant (Financial Focus)
    Accountant --> UC_Dashboard
    Accountant --> UC_StatFees
    Accountant --> UC_Export
```

## Chi tiết Use Case (Phân rã)

### 1. Dashboard Analytics
* **Biểu đồ**: Hiển thị tỷ lệ thanh toán, phân bố nhân khẩu theo độ tuổi/giới tính.
* **Tổng quan**: Số lượng hộ khẩu, tổng số cư dân, tổng tiền đã thu trong tháng.

### 2. Thống kê & Báo cáo
* **Thống kê nhân khẩu**: Lọc theo tạm trú, tạm vắng, độ tuổi lao động.
* **Thống kê Tài chính**: Danh sách các hộ chưa đóng phí.
* **Xuất dữ liệu**: Hỗ trợ xuất file Excel phục vụ việc nộp báo cáo cho cấp trên hoặc lưu trữ bản cứng.

