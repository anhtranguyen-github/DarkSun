# Đặc tả Chi tiết Bảng `users`

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **username** | Varchar(255) | 255 ký tự | NOT NULL, UNIQUE | Văn bản | Tên đăng nhập |
| **password** | Varchar(255) | 255 ký tự | NOT NULL | Văn bản (Hash) | Mã hóa BCRYPT |
| **full_name** | Varchar(255) | 255 ký tự | NOT NULL | Văn bản (Unicode) | Họ và tên đầy đủ |
| email | Varchar(255) | 255 ký tự | UNIQUE | Văn bản (Email) | |
| phone_number | Varchar(20) | 20 ký tự | | Văn bản | |
| avatar_url | Text | | | Văn bản (URL) | |
| status | Varchar(20) | 20 ký tự | DEFAULT 'active' | Văn bản | active/inactive |
| household_id | Int | | Khoá ngoại | Số nguyên dương | FK -> households(id) |
| created_at | Timestamp | | NOT NULL | Ngày giờ | |
| updated_at | Timestamp | | NOT NULL | Ngày giờ | |
