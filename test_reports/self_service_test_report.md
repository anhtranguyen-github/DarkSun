# Báo cáo Kiểm thử: Dịch vụ Cư dân (Self-Service)

### Chi tiết kịch bản kiểm thử (Happy Path + Exceptions + Security)

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Cư dân xem thông tin cá nhân (`/me/profile`) | Hiển thị đúng data của user đang login | Xử lý chuẩn | PASS |
| 2 | Cư dân xem lịch sử hóa đơn nhà mình | Trả về danh sách chính xác | Xử lý chuẩn | PASS |
| 3 | Cập nhật Email/SĐT cá nhân | Lưu thành công | Xử lý chuẩn | PASS |
| 4 | Thay đổi mật khẩu (Mật khẩu cũ đúng) | Đổi thành công | Xử lý chuẩn | PASS |
| 5 | Thay đổi mật khẩu: Mật khẩu cũ sai | Báo lỗi xác thực | Xử lý chuẩn | PASS |
| 6 | Cư dân gọi API `GET /households` (Vượt cấp) | Thông báo "Bạn không có quyền" (403) | Xử lý chuẩn | PASS |
| 7 | Cư dân gọi `PUT /me/profile` kèm `roleId: 1` | Chặn không cho tự nâng quyền Admin | **Không xử lý (Bị nâng quyền)** | FAIL |
| 8 | Xem hóa đơn ID của nhà hàng xóm qua URL | Chặn truy cập trái phép | **Không xử lý (Xem lén được)** | FAIL |
| 9 | Upload ảnh đại diện: File `.bat` (Mã độc) | Chặn upload file không phải ảnh | **Chưa có cấu hình chặn** | FAIL |
| 10 | Spam 100 lần đổi mật khẩu / giây | Chặn Rate Limit | **Không xử lý** | FAIL |

---
**Kết luận:** Tiện ích cư dân hoạt động tốt về mặt hiển thị, nhưng lỗ hổng Mass Assignment (nâng quyền) và IDOR (xem lén) là rủi ro cực lớn.
