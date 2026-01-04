# Thiết kế Chi tiết các Lớp và Gói thành phần

Tài liệu này trình bày thiết kế chi tiết các lớp (Class Diagram) cho từng phân hệ chính trong hệ thống DarkSun, tập trung vào quan hệ giữa các lớp trong mô hình MVC.

---

## 1. Phân hệ Quản lý Danh tính & Quyền truy cập (IAM)

### Biểu đồ thiết kế:
*(Tham khảo tệp: `iam_design.puml`)*

**Giải thích thiết kế:**
- **Quan hệ Hợp thành (Composition):** Lớp `User` và `Role` có quan hệ hợp thành với các lớp trung gian `UserRole` và `RolePermission`. Điều này thể hiện rằng các bản ghi liên kết không thể tồn tại độc lập nếu thiếu thực thể chính.
- **Quan hệ Phụ thuộc (Dependency):** `UserRoutes` phụ thuộc vào `AuthController` và `AuthMiddleware` để điều hướng và bảo mật các luồng yêu cầu.
- **Quan hệ Kết hợp (Association):** Một `User` có thể có nhiều `Role` thông qua bảng trung gian, cho phép phân quyền linh hoạt (RBAC).

---

## 2. Phân hệ Quản lý Hộ khẩu & Cư dân (Household & Resident)

### Biểu đồ thiết kế:
*(Tham khảo tệp: `household_design.puml`)*

**Giải thích thiết kế:**
- **Quan hệ Hợp thành (Composition):** `Household` đóng vai trò là thực thể gốc, chứa danh sách các `Resident` (nhân khẩu) và `Vehicle` (phương tiện). Khi một hộ khẩu bị xóa hoặc thay đổi, các thành phần con này sẽ bị ảnh hưởng trực tiếp.
- **Quan hệ Kết tập (Aggregation):** `Resident` có quan hệ kết tập với `TemporaryResidence`. Một cư dân có thể có hoặc không có các đăng ký tạm trú, và thông tin tạm trú mang tính chất bổ trợ cho thông tin cư dân.
- **Quan hệ Kết hợp (Association):** Quan hệ "Chủ hộ" giữa `Household` và `Resident` là một kết hợp 1-1 đặc biệt, chỉ định một cư dân cụ thể giữ vai trò đứng tên sổ hộ khẩu.

---

## 3. Phân hệ Quản lý Tài chính (Finance & Billing)

### Biểu đồ thiết kế:
*(Tham khảo tệp: `finance_design.puml`)*

**Giải thích thiết kế:**
- **Quan hệ Hợp thành (Composition):** `Invoice` (Hóa đơn) bắt buộc phải có ít nhất một `InvoiceDetail` (Chi tiết hóa đơn). Sự tồn tại của chi tiết hóa đơn hoàn toàn phụ thuộc vào vòng đời của hóa đơn chính.
- **Quan hệ Kết tập (Aggregation):** `FeePeriod` (Đợt thu) và `FeeType` (Loại phí) được gom nhóm lại trong `PeriodFee`. Đây là quan hệ kết tập vì các loại phí và đợt thu có thể tồn tại độc lập trước khi được gán cho nhau.
- **Quan hệ Kết hợp (Association):** `InvoiceDetail` kết hợp với `FeeType` để lấy thông tin về đơn giá và tên phí tại thời điểm xuất hóa đơn.

---

## Tổng kết quy tắc thiết kế áp dụng
1.  **Đóng gói (Encapsulation):** Các logic xử lý dữ liệu được đóng gói trong tầng `Models` thông qua ORM Sequelize.
2.  **Tách biệt trách nhiệm:** `Controllers` chỉ chịu trách nhiệm điều phối, không can thiệp sâu vào cấu trúc dữ liệu, sử dụng quan hệ phụ thuộc để giao tiếp với `Models`.
3.  **Tính mở rộng:** Sử dụng các bảng trung gian (Junction tables/classes) để giải quyết các quan hệ n-n, giúp dễ dàng thêm mới các vai trò hoặc quyền hạn mà không cần thay đổi schema của các bảng chính.
