# Statistics & Reporting Use Cases

```mermaid
usecaseDiagram
    actor "Kế toán (Accountant)" as Accountant
    actor "Quản trị viên (Admin)" as Admin

    package "Module Thống kê & Báo cáo" {
        usecase "Xem Dashboard Tổng quan" as UC_Dashboard
        usecase "Thống kê Nhân khẩu" as UC_StatResident
        usecase "Thống kê Tạm trú / Tạm vắng" as UC_StatTemp
        usecase "Thống kê Thu phí (Đã thu / Chưa thu)" as UC_StatFees
        usecase "Xuất Báo cáo Excel (Future)" as UC_Export
    }

    Admin --> UC_Dashboard
    Admin --> UC_StatResident
    Admin --> UC_StatTemp
    Admin --> UC_StatFees
    Admin --> UC_Export

    Accountant --> UC_Dashboard
    Accountant --> UC_StatFees
    Accountant --> UC_Export
```
