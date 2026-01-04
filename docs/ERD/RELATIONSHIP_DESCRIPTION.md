# Mô tả Chi tiết các Mối quan hệ giữa các Đối tượng Dữ liệu

Tài liệu này cung cấp mô tả chi tiết về các mối liên kết (Relationships) giữa các thực thể trong cơ sở dữ liệu hệ thống DarkSun, bao gồm loại quan hệ, ý nghĩa nghiệp vụ và các ràng buộc dữ liệu kèm theo.

---

## 1. Nhóm Quản trị Hệ thống (IAM)

### User - Role (n - n)
- **Mô tả:** Một người dùng có thể đảm nhận một hoặc nhiều vai trò (ví dụ: vừa là 'Cư dân' vừa là 'Manager'), và một vai trò có thể được gán cho nhiều người dùng khác nhau.
- **Ràng buộc:** Được triển khai thông qua bảng trung gian `user_roles`. Khi xóa một vai trò, các liên kết tương ứng của người dùng sẽ bị xóa bỏ nhưng người dùng vẫn tồn tại.

### Role - Permission (n - n)
- **Mô tả:** Một vai trò được cấu thành từ danh sách nhiều quyền hạn cụ thể (ví dụ: vai trò 'Admin' có tất cả các quyền). Ngược lại, một quyền (như 'xem_danh_sách') có thể thuộc về nhiều vai trò.
- **Ràng buộc:** Triển khai qua bảng `role_permissions`. Đây là cơ sở để thực hiện kiểm soát truy cập dựa trên vai trò (RBAC).

---

## 2. Nhóm Quản lý Hộ khẩu & Cư dân

### Household - Resident (1 - n)
- **Mô tả:** Quan hệ "Thành viên gia đình". Một hộ khẩu chứa một hoặc nhiều cư dân cùng sinh sống. Mỗi cư dân tại một thời điểm nhất định chỉ được đăng ký thường trú tại tối đa một hộ khẩu.
- **Ràng buộc:** Khóa ngoại `household_id` trong bảng `residents`.

### Household - Resident (1 - 1)
- **Mô tả:** Quan hệ "Chủ hộ". Mỗi hộ khẩu phải xác định duy nhất một cư dân làm chủ hộ để chịu trách nhiệm pháp lý và hành chính.
- **Ràng buộc:** Khóa ngoại `owner_id` trong bảng `households` tham chiếu đến `residents(id)`.

### Resident - TemporaryResidence (1 - n)
- **Mô tả:** Một cư dân có thể có lịch sử nhiều lần đăng ký tạm trú hoặc tạm vắng theo thời gian.
- **Ràng buộc:** Khi một cư dân bị xóa khỏi hệ thống, các bản ghi tạm trú/tạm vắng liên quan cũng sẽ bị xóa (Cascade Delete).

### Household - Vehicle (1 - n)
- **Mô tả:** Quan hệ sở hữu phương tiện. Mỗi hộ khẩu có thể đăng ký gửi nhiều xe (ô tô, xe máy) tại hầm chung cư.
- **Ràng buộc:** Biển số xe (`license_plate`) là duy nhất trên toàn hệ thống.

---

## 3. Nhóm Quản lý Tài chính & Phí

### Household - Invoice (1 - n)
- **Mô tả:** Mỗi đợt thu phí, một hộ khẩu sẽ nhận được một hóa đơn tổng hợp tất cả các loại phí dịch vụ liên quan.
- **Ràng buộc:** Chặn xóa hộ khẩu nếu vẫn còn hóa đơn ở trạng thái "Chưa thanh toán".

### FeePeriod - Invoice (1 - n)
- **Mô tả:** Một đợt thu phí (ví dụ: "Tháng 01/2026") sẽ phát sinh nhiều hóa đơn cho tất cả các hộ dân trong chung cư.
- **Ràng buộc:** Giúp thống kê doanh thu theo từng giai đoạn thời gian cụ thể.

### Invoice - InvoiceDetail (1 - n)
- **Mô tả:** Quan hệ "Hợp thành" (Composition). Một hóa đơn bao gồm nhiều dòng chi tiết, mỗi dòng tương ứng với một loại phí cụ thể (Phí vệ sinh, Phí gửi xe, v.v.).
- **Ràng buộc:** Nếu hóa đơn bị xóa, các chi tiết hóa đơn tương ứng bắt buộc phải bị xóa theo.

### FeeType - InvoiceDetail (1 - n)
- **Mô tả:** Mỗi dòng chi tiết hóa đơn được phân loại theo một loại phí cụ thể để lấy đơn giá và tên gọi.
- **Ràng buộc:** Chặn xóa tên loại phí nếu loại phí đó đã từng được sử dụng để xuất hóa đơn trong quá khứ.

### User - Invoice (1 - n)
- **Mô tả:** Quan hệ "Người thu tiền". Mỗi hóa đơn khi được thanh toán sẽ lưu lại ID của cán bộ (User) thực hiện việc thu tiền để đối soát.
- **Ràng buộc:** Khóa ngoại `cashier_id` tham chiếu đến bảng `users`.
