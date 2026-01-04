# Fees & Billing Use Cases

```mermaid
usecaseDiagram
    actor "Kế toán (Accountant)" as Accountant
    actor "Quản trị viên (Admin)" as Admin
    actor "Cư dân (Resident)" as Resident

    package "Module Quản lý Phí & Hóa đơn" {
        usecase "Quản lý Loại phí (Fee Types)" as UC_ManageFeeTypes
        usecase "Tạo Đợt thu phí (Fee Period)" as UC_CreatePeriod
        usecase "Cấu hình Phí cho Đợt thu" as UC_ConfigFee
        
        usecase "Tạo Hóa đơn (Invoices) hàng loạt" as UC_GenInvoice
        usecase "Ghi nhận Thanh toán" as UC_RecordPayment
        usecase "Sửa / Xóa Hóa đơn (Chưa thanh toán)" as UC_EditInvoice
        
        usecase "Xem danh sách Hóa đơn" as UC_ViewAllInvoices
        usecase "Xem Hóa đơn của mình" as UC_ViewMyInvoice
    }

    Admin --|> Accountant

    Accountant --> UC_ManageFeeTypes
    Accountant --> UC_CreatePeriod
    Accountant --> UC_ConfigFee
    Accountant --> UC_GenInvoice
    Accountant --> UC_RecordPayment
    Accountant --> UC_EditInvoice
    Accountant --> UC_ViewAllInvoices

    Resident --> UC_ViewMyInvoice
```
