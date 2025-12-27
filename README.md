# 🌙 BlueMoon Apartment Manager (IT4082 - Nhóm 18)

Hệ thống quản lý chung cư BlueMoon, được xây dựng để hỗ trợ Ban quản lý và Cư dân trong việc quản lý hộ khẩu, nhân khẩu, các khoản phí và đóng tiền.

## 🚀 Hướng dẫn Cài đặt & Chạy

Bạn có thể chạy dự án bằng cách **Thủ công (Khuyên dùng nếu không rành Docker)** hoặc **Sử dụng Docker**.

---

### 👉 Cách 1: Chạy Tự Động (Dễ nhất - Không cần cài Docker)
Yêu cầu: Máy tính đã cài **Node.js** (v14 trở lên).

1. **Windows:**
   - Double-click vào file `start.bat`.
   - Script sẽ tự động cài đặt mọi thứ và mở trình duyệt.

2. **Linux/Mac:**
   - Mở terminal tại thư mục dự án.
   - Chạy lệnh: `./start.sh`

_(Lần chạy đầu tiên sẽ mất khoảng 1-2 phút để cài đặt thư viện)._
- Web: [http://localhost:5173](http://localhost:5173)

---

### 👉 Cách 2: Chạy bằng Docker
Yêu cầu: Đã cài **Docker Desktop**.

1. **Windows:** Double-click file `docker-run.bat`.
2. **Linux/Mac:** Chạy lệnh `./docker-run.sh`.

- Web: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Tài khoản Demo (Mật khẩu: `password123`)

| Vai trò       | Username        | Mật khẩu      |
|---------------|-----------------|---------------|
| **Admin**     | `demo_admin`    | `password123` |
| **Kế toán**   | `demo_ketoan`   | `password123` |
| **Tổ trưởng** | `demo_totruong` | `password123` |
| **Tổ phó**    | `demo_topho`    | `password123` |
| **Cư dân**    | `demo_cudan`    | `password123` |

---

## 📚 Công nghệ sử dụng
- **Backend:** Node.js, Express.js
- **Frontend:** React.js, Vite
- **Database:** PostgreSQL (Cloud/Remote)
