# Đặc tả Chi tiết Bảng `fee_periods`

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **name** | Varchar(255) | 255 ký tự | NOT NULL | Văn bản (Unicode) | |
| start_date | Date | | | Ngày tháng năm | |
| end_date | Date | | | Ngày tháng năm | |
| status | Enum | | 'open','closed','pending' | Văn bản | |
| **type** | Enum | | 'mandatory','contribution' | Văn bản | |
| description | Text | | | Văn bản | |
| created_at | Timestamp | | NOT NULL | Ngày giờ | |
| updated_at | Timestamp | | NOT NULL | Ngày giờ | |
