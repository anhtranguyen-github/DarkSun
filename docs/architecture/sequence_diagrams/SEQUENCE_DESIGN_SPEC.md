# Phân bổ Trách nhiệm Use Case và Biểu đồ Trình tự

Tài liệu này mô tả cách các ca sử dụng (Use Case) được triển khai thông qua việc phân bổ trách nhiệm giữa các đối tượng trong hệ thống DarkSun, minh họa bằng các Biểu đồ Trình tự (Sequence Diagram).

---

## 1. Cơ sở Thiết kế
Dựa trên kiến trúc MVC, trách nhiệm của mỗi ca sử dụng được chia cho 3 nhóm đối tượng chính:
*   **Boundary (Routes/View):** Tiếp nhận yêu cầu từ người dùng và phản hồi kết quả.
*   **Control (Controllers/Middleware):** Điều phối luồng xử lý, kiểm tra logic nghiệp vụ và ràng buộc hệ thống.
*   **Entity (Models):** Thực hiện các thao tác truy xuất và cập nhật dữ liệu xuống cơ sở dữ liệu.

---

## 2. Các Ca sử dụng Chính

### A. Phân hệ Hệ thống & Bảo mật
*   **Đăng nhập (Login):** [login_sequence.puml](./login_sequence.puml)
    - *Giải thích:* Xác thực người dùng, kiểm tra trạng thái tài khoản (bị khóa/xóa) và cấp JWT.
*   **Quản lý người dùng:** (Tương tự luồng đăng ký nhưng thực hiện bởi Admin).

### B. Phân hệ Quản lý Hộ khẩu & Nhân khẩu
*   **Tạo mới Hộ khẩu:** [create_household_sequence.puml](./create_household_sequence.puml)
    - *Giải thích:* Sử dụng **Atomic Transaction** để tạo cả Hộ khẩu và Chủ hộ, đảm bảo dữ liệu không bị mâu thuẫn.
*   **Thêm mới Nhân khẩu:** [add_resident_sequence.puml](./add_resident_sequence.puml)
    - *Giải thích:* Kiểm tra sự tồn tại của hộ khẩu đích và ràng buộc tính duy nhất của CCCD trước khi thêm.
*   **Xóa Hộ khẩu:** [delete_household_sequence.puml](./delete_household_sequence.puml)
    - *Giải thích:* Triển khai **Business Cascade Check**. Chặn xóa nếu hộ khẩu vẫn còn nhân khẩu, phương tiện hoặc hóa đơn chưa thanh toán.
*   **Đăng ký Tạm trú/Tạm vắng:** [temp_residence_sequence.puml](./temp_residence_sequence.puml)
    - *Giải thích:* Xác thực cư dân và lưu vết thời gian hiệu lực của giấy phép.
*   **Đăng ký Phương tiện:** [vehicle_registration_sequence.puml](./vehicle_registration_sequence.puml)
    - *Giải thích:* Chuẩn hóa biển số xe và gán quyền sở hữu theo hộ khẩu.

### C. Phân hệ Quản lý Tài chính
*   **Tự động tạo Hóa đơn:** [generate_invoices_sequence.puml](./generate_invoices_sequence.puml)
    - *Giải thích:* Một trong những Use case phức tạp nhất. Hệ thống lặp qua danh sách hộ khẩu, tính toán phí dựa trên diện tích, số nhân khẩu và loại phương tiện thực tế của từng hộ tại thời điểm đó.
*   **Ghi nhận Thanh toán:** [record_payment_sequence.puml](./record_payment_sequence.puml)
    - *Giải thích:* Cập nhật trạng thái 'paid', ghi nhận phương thức thanh toán và định danh cán bộ thu phí.

---

## 3. Tổng kết Phân bổ Trách nhiệm
Thông qua các biểu đồ trên, ta thấy rõ sự phân bổ:
- **Boundary (Routes/Middleware):** Đảm nhận việc lọc dữ liệu rác ban đầu và kiểm tra quyền truy cập (Authorization).
- **Control (Controllers):** Nắm giữ các quy tắc nghiệp vụ (Business Rules) như: "Không được xóa chủ hộ trực tiếp", "Hóa đơn đã trả không được sửa".
- **Entity (Models):** Chịu trách nhiệm tương tác nguyên tử với DB và đảm bảo các ràng buộc dữ liệu (Unique, Not Null).
