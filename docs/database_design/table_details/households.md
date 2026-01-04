# Đặc tả Chi tiết Bảng `households`

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **household_code**| Varchar(255) | 255 ký tự | NOT NULL, UNIQUE | Văn bản | Số sổ hộ khẩu |
| owner_id | Int | | Khoá ngoại | Số nguyên dương | Tham chiếu residents |
| member_count | Int | | DEFAULT 0 | Số nguyên dương | |
| address_street | Varchar(255) | 255 ký tự | | Văn bản | |
| address_ward | Varchar(255) | 255 ký tự | | Văn bản | |
| address_district | Varchar(255) | 255 ký tự | | Văn bản | |
| address | Varchar(255) | 255 ký tự | | Văn bản | |
| area | Numeric(10,2) | | | Số thực | Diện tích |
| status | Varchar(50) | 50 ký tự | DEFAULT 'occupied' | Văn bản | |
| created_date | Date | | | Ngày tháng năm | |
| created_at | Timestamp | | NOT NULL | Ngày giờ | |
| updated_at | Timestamp | | NOT NULL | Ngày giờ | |
