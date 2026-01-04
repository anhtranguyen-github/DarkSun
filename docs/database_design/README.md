# Thiết kế Chi tiết Cơ sở Dữ liệu

Thư mục này chứa đặc tả chi tiết cho từng bảng dữ liệu trong hệ thống DarkSun, bao gồm các cấu hình về kiểu dữ liệu, ràng buộc toàn vẹn và quyền sở hữu.

## Danh sách các phân hệ bảng

1.  **[Phân hệ IAM](./iam_tables.md)**: Quản lý Tài khoản (User), Vai trò (Role) và Quyền hạn (Permission).
2.  **[Phân hệ Hộ khẩu & Cư dân](./household_tables.md)**: Quản lý Hộ gia đình (Household), Nhân khẩu (Resident), Tạm trú/Tạm vắng và Phương tiện.
3.  **[Phân hệ Tài chính & Phí](./finance_tables.md)**: Quản lý Loại phí (FeeType), Đợt thu (FeePeriod), và Hóa đơn (Invoice).

## Các quy tắc chung áp dụng
*   **Mã hóa ký tự**: Sử dụng UTF-8 cho tất cả các trường Unicode.
*   **Thời gian**: Tất cả các trường ngày tháng lưu dưới định dạng ISO 8601 (Timezone UTC).
*   **Toàn vẹn dữ liệu**: Các khóa ngoại (Foreign Keys) được thiết lập chặt chẽ để đảm bảo không có dữ liệu mồ côi.
*   **Audit Log**: Mọi bảng quan trọng đều có `created_at` và `updated_at` để theo dõi lịch sử cập nhật.
