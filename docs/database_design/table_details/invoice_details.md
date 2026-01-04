# Đặc tả Chi tiết Bảng `invoice_details`

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **invoice_id** | Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu invoices |
| **fee_type_id** | Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu fee_types |
| **quantity** | Numeric(10,2)| | NOT NULL | Số thực | |
| **price_at_time** | Decimal(12,2)| | NOT NULL | Số thực | |
| **amount** | Decimal(15,2)| | NOT NULL | Số thực | Thành tiền |
| created_at | Timestamp | | | Ngày giờ | |
| updated_at | Timestamp | | | Ngày giờ | |
