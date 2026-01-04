# Đặc tả Chi tiết Bảng `permissions`

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **code** | Varchar(50) | 50 ký tự | NOT NULL, UNIQUE | Văn bản | Mã quyền |
| **name** | Varchar(100) | 100 ký tự | NOT NULL | Văn bản (Unicode) | Tên quyền |
| group_name | Varchar(50) | 50 ký tự | | Văn bản | Nhóm module |
| description | Text | | | Văn bản | |
