# Đặc tả Chi tiết Cơ sở Dữ liệu - Phân hệ Hộ khẩu & Cư dân

Phân hệ này quản lý thông tin về các hộ gia đình, nhân khẩu, đăng ký tạm trú/tạm vắng và tài sản (phương tiện).

## 1. Bảng `households` (Hộ khẩu)

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **household_code**| Varchar(255) | 255 ký tự | NOT NULL, UNIQUE | Văn bản | Số sổ hộ khẩu |
| owner_id | Int | | Khoá ngoại | Số nguyên dương | Tham chiếu đến bảng residents (Chủ hộ) |
| member_count | Int | | DEFAULT 0 | Số nguyên dương | Tổng số nhân khẩu trong hộ |
| address_street | Varchar(255) | 255 ký tự | | Văn bản | Đường/Phố/Thôn |
| address_ward | Varchar(255) | 255 ký tự | | Văn bản | Phường/Xã |
| address_district | Varchar(255) | 255 ký tự | | Văn bản | Quận/Huyện |
| address | Varchar(255) | 255 ký tự | | Văn bản | Địa chỉ đầy đủ (Composite) |
| area | Numeric(10,2) | | | Số thực | Diện tích căn hộ/nhà |
| status | Varchar(50) | 50 ký tự | DEFAULT 'occupied' | Văn bản | Trạng thái (đang ở, trống,...) |
| created_date | Date | | | Ngày tháng năm | Ngày lập hộ khẩu |
| created_at | Timestamp | | NOT NULL | Ngày giờ | Hệ thống tự tạo |
| updated_at | Timestamp | | NOT NULL | Ngày giờ | Hệ thống tự cập nhật |

## 2. Bảng `residents` (Cư dân)

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **household_id** | Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu đến bảng households |
| **full_name** | Varchar(255) | 255 ký tự | NOT NULL | Văn bản (Unicode) | Họ tên cư dân |
| date_of_birth | Date | | | Ngày tháng năm | Ngày sinh |
| id_card_number | Varchar(20) | 20 ký tự | UNIQUE | Văn bản | Số CCCD/Passport |
| gender | Enum | | 'Nam','Nữ','Khác' | Văn bản | Giới tính |
| occupation | Varchar(255) | 255 ký tự | | Văn bản | Nghề nghiệp |
| relationship | Varchar(255) | 255 ký tự | | Văn bản | Quan hệ với chủ hộ |
| alias | Varchar(255) | 255 ký tự | | Văn bản | Tên gọi khác (bí danh) |
| birth_place | Varchar(255) | 255 ký tự | | Văn bản | Nơi sinh |
| native_place | Varchar(255) | 255 ký tự | | Văn bản | Nguyên quán |
| ethnicity | Varchar(50) | 50 ký tự | | Văn bản | Dân tộc |
| religion | Varchar(50) | 50 ký tự | | Văn bản | Tôn giáo |
| workplace | Varchar(255) | 255 ký tự | | Văn bản | Nơi làm việc |
| id_card_date | Date | | | Ngày tháng năm | Ngày cấp CCCD |
| id_card_place | Varchar(255) | 255 ký tự | | Văn bản | Nơi cấp CCCD |
| previous_residence| Varchar(255) | 255 ký tự | | Văn bản | Địa chỉ thường trú trước đây |
| move_in_date | Date | | | Ngày tháng năm | Ngày chuyển đến chung cư |
| created_at | Timestamp | | NOT NULL | Ngày giờ | |
| updated_at | Timestamp | | NOT NULL | Ngày giờ | |

## 3. Bảng `temporary_residences` (Tạm trú / Tạm vắng)

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **resident_id** | Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu đến bảng residents |
| **type** | Enum | | 'TamTru','TamVang' | Văn bản | Loại đăng ký |
| permit_code | Varchar(100) | 100 ký tự | UNIQUE | Văn bản | Mã số giấy phép |
| **start_date** | Date | | NOT NULL | Ngày tháng năm | Ngày bắt đầu hiệu lực |
| end_date | Date | | | Ngày tháng năm | Ngày hết hạn |
| address | Varchar(255) | 255 ký tự | | Văn bản | Địa chỉ tạm trú/địa chỉ đến |
| reason | Text | | | Văn bản | Lý do đăng ký |
| created_at | Timestamp | | NOT NULL | Ngày giờ | |
| updated_at | Timestamp | | NOT NULL | Ngày giờ | |

## 4. Bảng `vehicles` (Phương tiện)

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **household_id** | Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu đến bảng households |
| **license_plate** | Varchar(20) | 20 ký tự | NOT NULL, UNIQUE | Văn bản | Biển số xe |
| **type** | Enum | | 'Oto','XeMay',... | Văn bản | Loại phương tiện |
| name | Varchar(100) | 100 ký tự | | Văn bản | Tên xe (Vd: Honda SH) |
| color | Varchar(50) | 50 ký tự | | Văn bản | Màu sắc xe |
| created_at | Timestamp | | NOT NULL | Ngày giờ | |
| updated_at | Timestamp | | NOT NULL | Ngày giờ | |
