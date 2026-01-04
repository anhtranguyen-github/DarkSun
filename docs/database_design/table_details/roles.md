# Đặc tả Chi tiết Bảng `roles`

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **name** | Varchar(255) | 255 ký tự | NOT NULL, UNIQUE | Văn bản | Tên định danh |
| display_name | Varchar(255) | 255 ký tự | | Văn bản (Unicode) | Tên hiển thị |
| description | Text | | | Văn bản | Mô tả vai trò |
| created_at | Timestamp | | | Ngày giờ | |
| updated_at | Timestamp | | | Ngày giờ | |
