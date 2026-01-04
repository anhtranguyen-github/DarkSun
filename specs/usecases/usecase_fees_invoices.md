# Fees & Billing Use Cases

```mermaid
graph LR
    %% Actors
    Accountant["👤 Kế toán (Accountant)"]
    Admin["👤 Quản trị viên (Admin)"]
    Manager["👤 Tổ trưởng (Manager)"]
    Deputy["👤 Tổ phó (Deputy)"]
    Resident["👤 Cư dân (Resident)"]

    %% System
    subgraph Module ["Module Quản lý Phí & Hóa đơn"]
        direction TB
        UC_ManageFeeTypes(["Quản lý Loại phí (Fee Types)"])
        UC_CreatePeriod(["Tạo Đợt thu phí (Fee Period)"])
        UC_ConfigFee(["Cấu hình Phí cho Đợt thu"])
        
        UC_GenInvoice(["Tạo Hóa đơn (Invoices) hàng loạt"])
        UC_RecordPayment(["Ghi nhận Thanh toán"])
        UC_EditInvoice(["Sửa / Xóa Hóa đơn (Chưa thanh toán)"])
        
        UC_ViewAllInvoices(["Xem danh sách Hóa đơn"])
        UC_ViewMyInvoice(["Xem Hóa đơn của mình"])
    end

    %% Relationships - Staff (View)
    Manager --> UC_ViewAllInvoices
    Deputy --> UC_ViewAllInvoices

    %% Relationships - Financial Operators (Full Control)
    Accountant --> UC_ViewAllInvoices
    Accountant --> UC_ManageFeeTypes
    Accountant --> UC_CreatePeriod
    Accountant --> UC_ConfigFee
    Accountant --> UC_GenInvoice
    Accountant --> UC_RecordPayment
    Accountant --> UC_EditInvoice

    Admin --> UC_ViewAllInvoices
    Admin --> UC_ManageFeeTypes
    Admin --> UC_CreatePeriod
    Admin --> UC_ConfigFee
    Admin --> UC_GenInvoice
    Admin --> UC_RecordPayment
    Admin --> UC_EditInvoice

    %% Relationships - Resident
    Resident --> UC_ViewMyInvoice
```

## Chi tiết Use Case (Phân rã)

### 1. Quản lý Đợt thu (Fee Period Management)
* **Khởi tạo**: Chọn loại đợt thu (**Bắt buộc** hoặc **Đóng góp**).
* **Cấu hình Phí**: 
    - Với đợt **Bắt buộc**: Chọn các loại phí như Vệ sinh, Gửi xe... Thiết lập đơn giá hoặc dùng giá mặc định.
    - Với đợt **Đóng góp**: Chỉ cho phép chọn các loại quỹ từ thiện, khuyến học.
* **Chốt đợt thu**: Chuyển trạng thái từ `open` sang `closed` để ngăn chặn chỉnh sửa hóa đơn.

### 2. Quản lý Hóa đơn (Invoice Management)
* **Tạo hàng loạt**: Hệ thống duyệt danh sách hộ khẩu và phương tiện để tự động tính toán số tiền dựa trên diện tích và số xe.
* **Thanh toán**: Cập nhật trạng thái `paid` sau khi xác nhận nhận tiền thực tế.
* **Xuất hóa đơn**: Render file PDF/Hình ảnh cho cư dân tải về.

