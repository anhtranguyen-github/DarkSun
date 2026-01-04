# Đặc tả Chi tiết Cơ sở Dữ liệu - Phân hệ Tài chính & Phí

Phân hệ này quản lý các loại phí dịch vụ, các đợt thu phí và quy trình xuất hóa đơn, thu tiền.

## 1. Bảng `fee_types` (Loại phí)

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **name** | Varchar(255) | 255 ký tự | NOT NULL, UNIQUE | Văn bản (Unicode) | Tên loại phí |
| **unit** | Varchar(50) | 50 ký tự | NOT NULL | Văn bản | Đơn vị tính (Vd: m2, người, xe) |
| **price** | Decimal(12,2)| | NOT NULL | Số thực | Đơn giá |
| description | Text | | | Văn bản | Mô tả chi tiết |
| **category** | Enum | | 'mandatory','contribution' | Văn bản | Phân loại: Bắt buộc hoặc Đóng góp |
| created_at | Timestamp | | | Ngày giờ | |
| updated_at | Timestamp | | | Ngày giờ | |

## 2. Bảng `fee_periods` (Đợt thu phí)

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **name** | Varchar(255) | 255 ký tự | NOT NULL | Văn bản (Unicode) | Tên đợt thu (Vd: Phí tháng 12/2025) |
| start_date | Date | | | Ngày tháng năm | Ngày bắt đầu thu |
| end_date | Date | | | Ngày tháng năm | Ngày kết thúc thu |
| status | Enum | | 'open','closed','pending' | Văn bản | Trạng thái đợt thu |
| **type** | Enum | | 'mandatory','contribution' | Văn bản | Loại phí trong đợt này |
| description | Text | | | Văn bản | |
| created_at | Timestamp | | NOT NULL | Ngày giờ | |
| updated_at | Timestamp | | NOT NULL | Ngày giờ | |

## 3. Bảng `period_fees` (Gán phí cho đợt)

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **fee_period_id**| Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu đến bảng fee_periods |
| **fee_type_id** | Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu đến bảng fee_types |
| **amount** | Decimal(15,2)| | NOT NULL | Số thực | Số tiền cụ thể cho đợt này |
| description | Text | | | Văn bản | |
| type | Enum | | 'Bắt buộc', 'Đóng góp' | Văn bản | |

## 4. Bảng `invoices` (Hóa đơn)

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **household_id** | Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu đến bảng households |
| **fee_period_id**| Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu đến bảng fee_periods |
| **total_amount** | Decimal(15,2)| | NOT NULL | Số thực | Tổng số tiền phải nộp |
| **status** | Varchar(50) | 50 ký tự | DEFAULT 'unpaid' | Văn bản | Trạng thái thanh toán |
| payment_method | Enum | | 'TienMat','ChuyenKhoan' | Văn bản | Phương thức thanh toán |
| cashier_id | Int | | Khoá ngoại | Số nguyên dương | Người thu tiền (FK đến users) |
| paid_date | Date | | | Ngày tháng năm | Ngày thanh toán thực tế |
| notes | Text | | | Văn bản | |
| created_at | Timestamp | | NOT NULL | Ngày giờ | |
| updated_at | Timestamp | | NOT NULL | Ngày giờ | |

## 5. Bảng `invoice_details` (Chi tiết hóa đơn)

| Tên trường | Kiểu dữ liệu | Kích thước | Ràng buộc toàn vẹn | Khuôn dạng | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **id** | Int | | Khoá chính | Số nguyên dương | Tự tăng |
| **invoice_id** | Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu đến bảng invoices |
| **fee_type_id** | Int | | NOT NULL, Khoá ngoại | Số nguyên dương | Tham chiếu đến bảng fee_types |
| **quantity** | Numeric(10,2)| | NOT NULL | Số thực | Số lượng (Vd: 50m2, 3 người) |
| **price_at_time** | Decimal(12,2)| | NOT NULL | Số thực | Đơn giá tại thời điểm xuất hóa đơn |
| **amount** | Decimal(15,2)| | NOT NULL | Số thực | Thành tiền (quantity * price) |
| created_at | Timestamp | | | Ngày giờ | |
| updated_at | Timestamp | | | Ngày giờ | |
