# Mô hình Lớp Phân tích (Analysis Class Model)

Dựa trên việc phân tích các ca sử dụng và biểu đồ trình tự, hệ thống được cấu trúc thành các lớp phân tích theo 3 loại khuôn mẫu (stereotypes) chính: **Boundary (Biên)**, **Control (Điều khiển)**, và **Entity (Thực thể)**.

---

## 1. Thành phần của Mô hình
*   **Lớp Biên (Boundary):** Đóng vai trò là giao diện giữa hệ thống và tác nhân (Actor). Ví dụ: `AuthView`, `HouseholdView`, `InvoiceView`. Chúng chịu trách nhiệm thu thập dữ liệu đầu vào và hiển thị kết quả.
*   **Lớp Điều khiển (Control):** Chứa logic nghiệp vụ và điều phối luồng thực hiện của từng ca sử dụng. Ví dụ: `AuthControl` xử lý đăng ký/đăng nhập, `InvoiceControl` thực hiện quét danh sách hộ để tính phí.
*   **Lớp Thực thể (Entity):** Đại diện cho dữ liệu bền vững được lưu trữ trong hệ thống. Ví dụ: `User`, `Household`, `Resident`, `Invoice`.

---

## 2. Phân bổ Trách nhiệm trong thiết kế
Mô hình phân tích giúp xác định các phương thức và thuộc tính cốt lõi của các lớp:

### A. Phân hệ Quản lý Cư dân
- **Control (`HouseholdControl`):** Triển khai các quy tắc kiểm tra ràng buộc trước khi xóa (chặn xóa nếu còn nhân khẩu) và điều phối việc thêm mới nhân khẩu vào hộ.
- **Entity (`Household`, `Resident`):** Chứa các thông tin định danh và phương thức cập nhật cơ bản.

### B. Phân hệ Quản lý Tài chính
- **Control (`InvoiceControl`):** Đây là thành phần quan trọng nhất, chứa phương thức `calculateFees()` để tính toán tiền dựa trên dữ liệu từ các lớp thực thể khác.
- **Boundary (`InvoiceView`):** Cung cấp các biểu mẫu ghi nhận thanh toán và danh sách hóa đơn cho kế toán.

---

## 3. Ý nghĩa của việc thiết kế lớp phân tách
Việc phân chia này đảm bảo nguyên lý **Tách biệt trách nhiệm (Separation of Concerns)**:
1.  Thay đổi về giao diện (Boundary) sẽ không ảnh hưởng đến logic nghiệp vụ (Control).
2.  Thay đổi về cấu trúc cơ sở dữ liệu (Entity) chỉ yêu cầu cập nhật tại các lớp thực thể, trong khi các lớp điều khiển vẫn giữ nguyên logic xử lý luồng.
3.  Tăng khả năng tái sử dụng các lớp thực thể cho nhiều ca sử dụng khác nhau.

*(Xem chi tiết biểu đồ tại tệp: `analysis_class_diagram.puml`)*
