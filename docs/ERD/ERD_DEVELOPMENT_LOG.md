# Tài liệu Xây dựng Biểu đồ Thực thể Liên kết (ERD)

Tài liệu này mô tả quy trình 3 bước để xây dựng mô hình dữ liệu cho dự án DarkSun, đảm bảo tính nhất quán và toàn vẹn của thông tin.

---

## Bước 1: Xác định các Đối tượng Dữ liệu (Entities)

Dựa trên yêu cầu nghiệp vụ quản lý chung cư, hệ thống xác định 11 thực thể chính chia thành 3 nhóm:
1.  **Nhóm Quản trị (IAM):** `User` (Người dùng), `Role` (Vai trò), `Permission` (Quyền hạn).
2.  **Nhóm Hộ khẩu (Residence):** `Household` (Hộ khẩu), `Resident` (Cư dân), `Vehicle` (Phương tiện), `TemporaryResidence` (Tạm trú/vắng).
3.  **Nhóm Tài chính (Finance):** `FeeType` (Loại phí), `FeePeriod` (Đợt thu), `Invoice` (Hóa đơn), `InvoiceDetail` (Chi tiết hóa đơn).

---

## Bước 2: Xác định Đặc tính của các Đối tượng (Attributes)

Mỗi thực thể được định nghĩa bằng các thuộc tính định danh và thuộc tính mô tả:
- **Thực thể Resident:** Chứa các đặc tính cá nhân như `fullName`, `dateOfBirth`, `idCardNumber` (Định danh duy nhất), `gender`.
- **Thực thể Household:** Chứa các đặc tính về nơi ở như `householdCode` (Số sổ), `address`, `area` (Dùng để tính phí).
- **Thực thể Invoice:** Chứa các đặc tính giao dịch như `totalAmount`, `status` (Đã nộp/Chưa nộp), `paidDate`.

---

## Bước 3: Xác định các Mối quan hệ giữa các Đối tượng (Relationships)

Hệ thống thiết lập các mối quan hệ logic để kết nối dữ liệu:

1.  **Quan hệ 1 - n (Một - Nhiều):**
    - Một `Household` có nhiều `Resident` (Thành viên trong hộ).
    - Một `Household` có nhiều `Vehicle`.
    - Một `Invoice` chứa nhiều `InvoiceDetail`.
2.  **Quan hệ 1 - 1 (Một - Một):**
    - Một `Household` có duy nhất một `Resident` đóng vai trò là Chủ hộ (`Owner`).
3.  **Quan hệ n - n (Nhiều - Nhiều):**
    - Một `User` có thể đảm nhận nhiều `Role`, và một `Role` có thể gán cho nhiều `User`. (Triển khai thông qua bảng trung gian `UserRoles`).
    - Một `Role` gồm nhiều `Permission`, và ngược lại.

---

## Tổng kết Mô hình
Biểu đồ ERD (sử dụng ký hiệu Crow's Foot) cung cấp cái nhìn tổng quát về cấu trúc dữ liệu, là nền tảng để thiết kế cơ sở dữ liệu vật lý trên PostgreSQL.

*(Xem chi tiết biểu đồ tại tệp: `docs/ERD/formal_erd.puml`)*
