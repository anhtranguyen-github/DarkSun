# 🌙 BlueMoon Apartment Manager (IT4082 - Nhóm 18)

Hệ thống quản lý chung cư BlueMoon, được xây dựng để hỗ trợ Ban quản lý và Cư dân trong việc quản lý hộ khẩu, nhân khẩu, các khoản phí và đóng tiền.

## 🚀 Chạy Nhanh (Sử dụng Docker) - **KHUYÊN DÙNG**
Dự án đã được đóng gói sẵn, bạn không cần cài đặt môi trường lập trình.

### 1. Yêu cầu
- Cài đặt **Docker Desktop** trên máy tính.

### 2. Khởi chạy
- **Windows**: Chạy file `docker-run.bat` (Double-click)
- **Linux/Mac**: Chạy lệnh `./docker-run.sh` trong terminal.

_(Lần đầu chạy sẽ mất vài phút để tải và build chương trình)._

### 3. Truy cập
Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Tài khoản Demo (Mật khẩu: `password123`)

| Vai trò       | Username        | Mô tả chức năng chính |
|---------------|-----------------|-----------------------|
| **Admin**     | `demo_admin`    | Quản trị toàn hệ thống (Users, Roles, mọi chức năng) |
| **Kế toán**   | `demo_ketoan`   | Quản lý các loại phí, đợt thu, hóa đơn, thống kê |
| **Tổ trưởng** | `demo_totruong` | Quản lý hộ khẩu, nhân khẩu, tạm trú/tạm vắng |
| **Tổ phó**    | `demo_topho`    | Hỗ trợ quản lý dân cư |
| **Cư dân**    | `demo_cudan`    | Xem thông tin cá nhân, xem hóa đơn, lịch sử đóng phí |

---

## 🛠️ Cài đặt Thủ công (Dành cho Developer)
Nếu muốn chạy môi trường phát triển (Dev) không qua Docker:

**Yêu cầu:** Node.js v14+

1. **Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   # Server chạy tại: http://localhost:5000
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   # Web chạy tại: http://localhost:5173
   ```

3. **Chạy nhanh cả hai:**
   - Windows: Chạy file `start.bat`
   - Linux: Chạy file `start.sh`

---

## 📚 Công nghệ sử dụng
- **Backend:** Node.js, Express.js
- **Frontend:** React.js, Vite
- **Database:** PostgreSQL (Cloud/Remote)
- **Containerization:** Docker, Nginx

## 👥 Nhóm phát triển
- IT4082 - Kỹ thuật phần mềm - Nhóm 18
