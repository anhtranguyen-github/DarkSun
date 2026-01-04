# Đặc tả Chi tiết Bảng `invoices`

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **household_id** | Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu households |
| **fee_period_id**| Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu fee_periods |
| **total_amount** | Decimal(15,2)| | NOT NULL | Số thực | |
| **status** | Varchar(50) | 50 ký tự | DEFAULT 'unpaid' | Văn bản | |
| payment_method | Enum | | 'TienMat','ChuyenKhoan' | Văn bản | |
| cashier_id | Int | | Khoá ngoại | Số nguyên dương | Tham chiếu users |
| paid_date | Date | | | Ngày tháng năm | |
| notes | Text | | | Văn bản | |
| created_at | Timestamp | | NOT NULL | Ngày giờ | |
| updated_at | Timestamp | | NOT NULL | Ngày giờ | |
