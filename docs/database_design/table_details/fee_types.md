# Đặc tả Chi tiết Bảng `fee_types`

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **name** | Varchar(255) | 255 ký tự | NOT NULL, UNIQUE | Văn bản (Unicode) | |
| **unit** | Varchar(50) | 50 ký tự | NOT NULL | Văn bản | m2, người, xe,... |
| **price** | Decimal(12,2)| | NOT NULL | Số thực | |
| description | Text | | | Văn bản | |
| **category** | Enum | | 'mandatory','contribution' | Văn bản | |
| created_at | Timestamp | | | Ngày giờ | |
| updated_at | Timestamp | | | Ngày giờ | |
