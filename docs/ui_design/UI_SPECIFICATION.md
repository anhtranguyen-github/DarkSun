# Đặc tả Thiết kế Giao diện người dùng (UI Specification)

Tài liệu này cung cấp các phân tích chi tiết về luồng điều hướng và đặc tả các thành phần trên từng màn hình của hệ thống DarkSun.

---

## 1. Biểu đồ Điều hướng (Navigation Diagram)

Biểu đồ dưới đây mô tả cấu trúc phân cấp các màn hình và luồng chuyển đổi giữa chúng.

*(Tham khảo tệp: `navigation_diagram.puml`)*

---

## 2. Đặc tả Chi tiết các Màn hình

### 2.1. Màn hình Chính (Dashboard)
Màn hình làm việc sau khi người dùng đăng nhập thành công. Chứa các thông tin thống kê tổng quan.

| Điều khiển | Thông tin dữ liệu | Loại | Thuộc tính | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **Tiêu đề Dashboard** | Chế độ Dark mode, tên "Dashboard" | Text Label | Hiển thị | Font: Inter, Bold |
| **Thẻ Nhân khẩu** | Tổng số nhân khẩu trên địa bàn | Card (Icon + Text) | Hiển thị | Lấy từ API `/api/residents/count` |
| **Thẻ Hộ khẩu** | Tổng số hộ khẩu đăng ký | Card (Icon + Text) | Hiển thị | Lấy từ API `/api/households/count` |
| **Thẻ Tạm trú** | Số lượng người đang tạm trú | Card (Icon + Text) | Hiển thị | Enum: 'TamTru' |
| **Thẻ Tạm vắng** | Số lượng người đang tạm vắng | Card (Icon + Text) | Hiển thị | Enum: 'TamVang' |
| **Nút SideMenu** | Chuyển đến các module quản lý | List Item / Icon | Tương tác | Hiệu ứng Hover, Active state |

### 2.2. Màn hình Quản lý Hộ khẩu
Màn hình danh sách các hộ gia đình trong chung cư.

| Điều khiển | Thông tin dữ liệu | Loại | Thuộc tính | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **Bảng Hộ khẩu** | STT, Mã hộ, Chủ hộ, Địa chỉ, Trạng thái | Data Table | Hiển thị | Hỗ trợ phân trang, sắp xếp |
| **Thanh tìm kiếm** | Tìm theo mã hộ hoặc tên chủ hộ | Input Field | Tương tác | Tìm kiếm Ilike (không phân biệt hoa thường) |
| **Nút Thêm mới** | Mở Form tạo hộ khẩu mới | Button | Tương tác | Chỉ hiển thị cho Admin/Manager |
| **Nút Thống kê** | Chuyển sang biểu đồ mật độ dân cư | Link | Tương tác | |

### 2.3. Màn hình Quản lý Tài chính
Màn hình quản lý các đợt thu và hóa đơn hộ dân.

| Điều khiển | Thông tin dữ liệu | Loại | Thuộc tính | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **Nút Tạo hóa đơn** | Kích hoạt luồng tạo hóa đơn tự động | Button | Tương tác | Yêu cầu xác nhận (Modal) |
| **Bộ lọc Trạng thái** | Lọc hóa đơn: Đã nộp / Chưa nộp | Select Box | Tương tác | |
| **Bảng Hóa đơn** | Mã hộ, Đợt thu, Tổng tiền, Trạng thái | Data Table | Hiển thị | |
| **Nút Ghi nhận** | Mở form ghi nhận thanh toán nhanh | Action Icon | Tương tác | Cập nhật 'paid_date' và 'cashier_id' |

---

## 3. Quy chuẩn UI/UX chung
- **Chủ đề (Theme):** Dark Mode (Chủ đạo), Modern & Premium.
- **Màu sắc:** Primary (#6366f1 - Indigo), Success (#22c55e - Green), Danger (#ef4444 - Red).
- **Typography:** Font chữ hệ thống (Inter/Roboto), kích thước cơ bản 14px-16px.
- **Responsive:** Tương thích tốt trên màn hình Desktop (tối ưu) và Tablet.
