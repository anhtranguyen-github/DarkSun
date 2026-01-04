# Hướng dẫn Cài đặt và Sử dụng Phần mềm

## 1. Hướng dẫn cài đặt
Hướng dẫn cài đặt phần mềm này nhằm mục đích chỉ ra các yêu cầu và các bước cài đặt cụ thể cho hệ thống Quản lý Chung cư BlueMoon (DarkSun), giúp người dùng và kỹ thuật viên tránh được các sai sót trong quá trình triển khai.

## 2. Đối tượng, phạm vi sử dụng
*   **Đối tượng sử dụng:** Ban quản trị chung cư, nhân viên quản lý dân cư, kế toán tòa nhà và cư dân đang sinh sống tại chung cư.
*   **Phạm vi sử dụng:** Hệ thống được sử dụng nội bộ trong công tác quản lý thông tin hộ khẩu, nhân khẩu, phương tiện, tính toán hóa đơn dịch vụ và báo cáo thống kê dân cư.

## 3. Xác định các yêu cầu cài đặt

### Yêu cầu phần cứng
*   **CPU:** tối thiểu 1.1 GHz trở lên (Khuyến nghị Dual Core trở lên).
*   **Bộ nhớ trong (RAM):** tối thiểu 2 GB (Khuyến nghị 4 GB để chạy mượt mà cả Backend và Frontend).
*   **Ổ cứng:** trống ít nhất 1 GB cho mã nguồn và cơ sở dữ liệu.

### Yêu cầu phần mềm
*   **Hệ điều hành:** Windows 7/10/11, Linux (Ubuntu/CentOS), hoặc macOS.
*   **Môi trường thực thi:** Node.js phiên bản 18.0 trở lên.
*   **Trình duyệt web:** Google Chrome, Firefox, hoặc Microsoft Edge phiên bản mới nhất.
*   **Công cụ hỗ trợ (tùy chọn):** Docker và Docker Compose (nếu muốn cài đặt nhanh qua container).

## 4. Hướng dẫn chi tiết các bước cài đặt

### Bước 1: Tải mã nguồn
Tải thư mục dự án `DarkSun` về máy tính hoặc clone từ repository.

### Bước 2: Cấu hình môi trường
1.  Truy cập vào thư mục `backend/`.
2.  Tạo file `.env` từ file `.env.example`.
3.  Cấu hình các thông số kết nối cơ sở dữ liệu và mã bí mật JWT (JWT_SECRET).

### Bước 3: Cài đặt thư viện
Mở terminal tại thư mục gốc của dự án và chạy:
```bash
# Cài đặt cho Backend
cd backend
npm install

# Cài đặt cho Frontend
cd ../frontend
npm install
```

### Bước 4: Khởi chạy hệ thống
Người dùng có thể khởi chạy bằng 2 cách:

*   **Cách 1 (Sử dụng Script tự động - Khuyến nghị):**
    Tại thư mục gốc, chạy file `run.bat` (Windows) hoặc dùng script khởi động để hệ thống tự động thiết lập và chạy cả Backend & Frontend.

*   **Cách 2 (Chạy thủ công):**
    1. Terminal 1 (Backend): `cd backend && npm run dev`
    2. Terminal 2 (Frontend): `cd frontend && npm run dev`

## 5. Hướng dẫn sử dụng phần mềm

### 5.1. Quản lý Truy cập
*   **Đăng nhập:** Truy cập hệ thống, nhập tài khoản và mật khẩu. Người dùng sẽ được điều hướng đến Trang chủ tùy theo vai trò.
*   **Đăng ký Cư dân:** Người dùng mới có thể chọn "Đăng ký" để tạo tài khoản Cư dân. Mặc định tài khoản mới sẽ ở vai trò `resident` và cần được Admin/Manager liên kết với hộ khẩu sau khi đăng ký.
*   **Đổi mật khẩu:** Cư dân có thể vào mục "Hồ sơ" để đổi mật khẩu. Mật khẩu phải từ 6 ký tự trở lên.

### 5.2. Quản lý Dân cư (Dành cho Manager/Deputy)
*   **Quản lý Hộ khẩu:**
    1.  Nhấn "Tạo Hộ Khẩu Mới" để bắt đầu. Nhập mã hộ (VD: HK-101), diện tích và địa chỉ.
    2.  Hệ thống yêu cầu nhập thông tin Chủ hộ ngay khi tạo.
    3.  Để thay đổi chủ hộ, chọn hộ khẩu cần sửa và cập nhật lại thông tin chủ hộ. Hệ thống sẽ tự động chuyển chủ hộ cũ thành "Thành viên".
*   **Quản lý Nhân khẩu:**
    1.  Chọn mục "Thêm Nhân Khẩu" để đăng ký cư dân vào các hộ đã có.
    2.  Nhập CCCD (9 hoặc 12 số), ngày sinh và quê quán.
    3.  Hệ thống tự động kiểm tra định dạng tên và loại bỏ các ký tự độc hại (XSS).
*   **Tạm trú & Tạm vắng:**
    1.  Vào mục "Khai báo cư trú" để đăng ký các trường hợp tạm thời.
    2.  Yêu cầu bắt buộc nhập ngày bắt đầu và ngày kết thúc (ngày kết thúc không được trước ngày bắt đầu).

### 5.3. Quản lý Tài chính (Dành cho Accountant/Admin)
*   **Thiết lập Loại phí:**
    1.  Kế toán định nghĩa các loại phí như "Phí vệ sinh", "Phí gửi xe", "Phí quản lý".
    2.  Chọn đơn vị tính (theo người, theo m2, hoặc theo phương tiện).
*   **Quy trình Thu phí:**
    1.  **Bước 1:** Tạo "Kỳ thu phí" mới (VD: Tháng 01/2026).
    2.  **Bước 2:** Gán các Loại phí cần thu vào kỳ này.
    3.  **Bước 3:** Nhấn "Tạo hóa đơn hàng loạt". Hệ thống sẽ tự động tính toán số tiền cho từng hộ dựa trên dữ liệu nhân khẩu và diện tích thực tế.
    4.  **Bước 4:** Quản lý thanh toán. Khi căn hộ đóng tiền, chuyển trạng thái sang "Đã thanh toán" (Paid). Sau khi thanh toán, hóa đơn sẽ được khóa để tránh chỉnh sửa.

### 5.4. Dashboard và Báo cáo
*   **Thống kê tổng quan:** Xem số liệu mật độ dân cư, biểu đồ doanh thu hàng tháng tại trang chủ.
*   **Lọc dữ liệu nâng cao:** Sử dụng bộ lọc theo nhóm tuổi (Dưới 18, 18-35...) hoặc theo diện tích để phân tích dữ liệu dân cư.
*   **Xuất báo cáo:** Nhấn nút "Xuất PDF" tại các trang Quản lý hoặc Thống kê để tải về bản in chính thức.

### 5.5. Cổng dịch vụ Cư dân (Dành cho Resident)
*   **Tra cứu Hóa đơn:** Cư dân chỉ có quyền xem các hóa đơn thuộc hộ gia đình của mình.
*   **Xem thông tin Hộ khẩu:** Cư dân có thể xem danh sách thành viên và phương tiện đang đăng ký dưới tên hộ gia đình mình.
*   **Cập nhật thông tin:** Cư dân có thể yêu cầu cập nhật Họ tên, Email hoặc Số điện thoại thông qua trang Hồ sơ cá nhân.
