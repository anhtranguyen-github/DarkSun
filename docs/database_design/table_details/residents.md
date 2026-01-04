# Đặc tả Chi tiết Bảng `residents`

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **household_id** | Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu households |
| **full_name** | Varchar(255) | 255 ký tự | NOT NULL | Văn bản (Unicode) | |
| date_of_birth | Date | | | Ngày tháng năm | |
| id_card_number | Varchar(20) | 20 ký tự | UNIQUE | Văn bản | |
| gender | Enum | | 'Nam','Nữ','Khác' | Văn bản | |
| occupation | Varchar(255) | 255 ký tự | | Văn bản | |
| relationship | Varchar(255) | 255 ký tự | | Văn bản | Quan hệ với chủ hộ |
| alias | Varchar(255) | 255 ký tự | | Văn bản | |
| birth_place | Varchar(255) | 255 ký tự | | Văn bản | |
| native_place | Varchar(255) | 255 ký tự | | Văn bản | |
| ethnicity | Varchar(50) | 50 ký tự | | Văn bản | |
| religion | Varchar(50) | 50 ký tự | | Văn bản | |
| workplace | Varchar(255) | 255 ký tự | | Văn bản | |
| id_card_date | Date | | | Ngày tháng năm | |
| id_card_place | Varchar(255) | 255 ký tự | | Văn bản | |
| previous_residence| Varchar(255) | 255 ký tự | | Văn bản | |
| move_in_date | Date | | | Ngày tháng năm | |
| created_at | Timestamp | | NOT NULL | Ngày giờ | |
| updated_at | Timestamp | | NOT NULL | Ngày giờ | |
