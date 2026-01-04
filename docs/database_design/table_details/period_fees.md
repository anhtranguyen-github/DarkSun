# Đặc tả Chi tiết Bảng `period_fees`

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **fee_period_id**| Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu fee_periods |
| **fee_type_id** | Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu fee_types |
| **amount** | Decimal(15,2)| | NOT NULL | Số thực | |
| description | Text | | | Văn bản | |
| type | Enum | | 'Bắt buộc', 'Đóng góp' | Văn bản | |
