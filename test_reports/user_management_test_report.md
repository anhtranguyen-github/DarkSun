# Báo cáo Kiểm thử: Quản lý Người dùng & Phân quyền (Users & RBAC) - Toàn diện (Final)

### Chi tiết kịch bản kiểm thử (Happy Path + Exceptions + Security + Known Bugs)

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Admin xem danh sách toàn bộ người dùng | Trả về thông tin đầy đủ | Xử lý chuẩn | PASS |
| 2 | **[BUG-AUTH-01 / IDOR]** Resident gọi API lấy thông tin Private | Chặn quyền truy cập (403) | **Không xử lý (Lộ data)** | FAIL |
| 3 | Cư dân sửa profile của Cư dân khác | Chặn quyền truy cập | Xử lý chuẩn | PASS |
| 4 | **[Mass Assignment]** Tự nâng quyền Admin qua API cập nhật | Chặn mọi field nhạy cảm khi không phải Admin | **Không xử lý (Nâng quyền được)** | FAIL |
| 5 | Xóa Role 'Admin' duy nhất của hệ thống | Chặn xóa để tránh Lockout | **Xử lý sai (Xóa mất quyền Admin)** | FAIL |
| 6 | Cấp pass `password123` mặc định cho user mới | Đăng nhập thành công | Xử lý chuẩn | PASS |
| 7 | Khóa tài khoản (`status: locked`) | User không thể đăng nhập | Xử lý chuẩn | PASS |
| 8 | Truy cập API không có Token | Thông báo lỗi xác thực | Xử lý chuẩn | PASS |
| 9 | Token hợp lệ nhưng user đã bị xóa khỏi DB | Chặn truy cập | **Xử lý sai (Vẫn vào được)** | FAIL |
| 10 | Đăng nhập với Username là chuỗi rỗng `""` | Báo lỗi đăng nhập | Xử lý chuẩn | PASS |
| 11 | Sửa đổi trạng thái của Admin khác | Chặn không cho hạ cấp đồng nghiệp | **Không xử lý** | FAIL |
| 12 | Gửi `roles` dạng chuỗi thay vì mảng | Báo lỗi định dạng | **Xử lý sai (Crash server)** | FAIL |

---
**Kết luận:** Hệ thống cần bổ sung whitelist các field được phép cập nhật (Mass Assignment) và kiểm tra tính toàn vẹn của Role hệ thống trước khi xóa.
