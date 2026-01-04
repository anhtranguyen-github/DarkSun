# Đặc tả Chi tiết Bảng `vehicles`

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **household_id** | Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu households |
| **license_plate** | Varchar(20) | 20 ký tự | NOT NULL, UNIQUE | Văn bản | |
| **type** | Enum | | 'Oto','XeMay',... | Văn bản | |
| name | Varchar(100) | 100 ký tự | | Văn bản | |
| color | Varchar(50) | 50 ký tự | | Văn bản | |
| created_at | Timestamp | | NOT NULL | Ngày giờ | |
| updated_at | Timestamp | | NOT NULL | Ngày giờ | |
