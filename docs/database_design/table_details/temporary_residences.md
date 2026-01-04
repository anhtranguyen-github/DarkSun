# Đặc tả Chi tiết Bảng `temporary_residences`

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **resident_id** | Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu residents |
| **type** | Enum | | 'TamTru','TamVang' | Văn bản | |
| permit_code | Varchar(100) | 100 ký tự | UNIQUE | Văn bản | |
| **start_date** | Date | | NOT NULL | Ngày tháng năm | |
| end_date | Date | | | Ngày tháng năm | |
| address | Varchar(255) | 255 ký tự | | Văn bản | |
| reason | Text | | | Văn bản | |
| created_at | Timestamp | | NOT NULL | Ngày giờ | |
| updated_at | Timestamp | | NOT NULL | Ngày giờ | |
