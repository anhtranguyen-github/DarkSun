# 🐳 Hướng dẫn Chạy BlueMoon với Docker

Dự án này đã được đóng gói sẵn với Docker. Bạn có thể chạy ngay lập tức mà không cần cài đặt Node.js hay cấu hình môi trường phức tạp.

## 🚀 Đăng nhập Nhanh
Dưới đây là danh sách tài khoản demo đã được tạo sẵn cho các quyền khác nhau (Mật khẩu chung: `password123`):

| Vai trò (Role) | Username        | Password      | Ghi chú |
|----------------|-----------------|---------------|---------|
| **Admin**      | `demo_admin`    | `password123` | Quản trị viên (Full quyền) |
| **Kế toán**    | `demo_ketoan`   | `password123` | Quản lý phí, hóa đơn |
| **Tổ trưởng**  | `demo_totruong` | `password123` | Quản lý nhân khẩu, hộ khẩu |
| **Tổ phó**     | `demo_topho`    | `password123` | Hỗ trợ quản lý |
| **Cư dân**     | `demo_cudan`    | `password123` | Xem thông tin cá nhân/hóa đơn |

---

## 🛠️ Cách chạy ứng dụng

### 1. Yêu cầu
- Máy tính đã cài đặt **Docker Desktop**.

### 2. Khởi chạy
- **Windows**: Chạy file `docker-run.bat`
- **Linux/Mac**: Chạy file `docker-run.sh` (hoặc mở terminal gõ `./docker-run.sh`)

(Lần đầu chạy sẽ mất vài phút để tải và build chương trình).

### 3. Truy cập
Sau khi chạy xong, mở trình duyệt và truy cập:
- **Trang chủ**: [http://localhost:3000](http://localhost:3000)

---

## 🛑 Dừng ứng dụng
Để tắt server, chạy lệnh sau trong terminal:
```bash
docker-compose down
```

## ⚠️ Lưu ý kỹ thuật
- Ứng dụng Frontend chạy port `3000`.
- Ứng dụng Backend chạy port `5000`.
- Cơ sở dữ liệu đang kết nối tới server online (`dingleberries.ddns.net`). Đảm bảo máy tính có kết nối mạng.
