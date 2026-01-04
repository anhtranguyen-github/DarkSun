# Báo cáo Kiểm thử: Dịch vụ Cư dân (Self-Service)

**Cập nhật:** 2026-01-04 | **Phiên bản:** 2.1

### Chi tiết kịch bản kiểm thử

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Xem thông tin cá nhân `/me/profile` | Hiển thị đúng | Xử lý chuẩn | PASS |
| 2 | Xem lịch sử hóa đơn nhà mình | Đúng danh sách | Xử lý chuẩn | PASS |
| 3 | Cập nhật `fullName` | Lưu thành công | Xử lý chuẩn | PASS |
| 4 | Cập nhật `email` | Lưu thành công | Xử lý chuẩn | PASS |
| 5 | Đổi mật khẩu (mật khẩu cũ đúng) | Đổi thành công | Xử lý chuẩn | PASS |
| 6 | Đổi mật khẩu (mật khẩu cũ sai) | Báo lỗi xác thực | Xử lý chuẩn | PASS |
| 7 | Gọi `GET /households` | 403 | Xử lý chuẩn | PASS |
| 8 | **Profile kèm `roleId: 1`** | Chặn Mass Assignment | Xử lý chuẩn | **PASS** ✅ |
| 9 | IDOR: Xem hóa đơn nhà khác | Chặn 403 | Không xử lý | FAIL |
| 10 | Upload avatar: File `.bat` | Chặn | Xử lý chuẩn | PASS |
| 11 | Spam đổi mật khẩu | Rate limit | Không xử lý | FAIL |
| 12 | **Cập nhật `status` trái phép** | Chặn | Xử lý chuẩn | **PASS** ✅ |
| 13 | **Cập nhật `householdId` trái phép** | Chặn | Xử lý chuẩn | **PASS** ✅ |
| 14 | **Mật khẩu mới < 6 ký tự** | Báo lỗi | Xử lý chuẩn | **PASS** ✅ |
| 15 | Xem thông tin hộ khẩu của mình | Cho phép | Xử lý chuẩn | PASS |
| 16 | Xem nhân khẩu trong hộ mình | Cho phép | Xử lý chuẩn | PASS |
| 17 | Xem xe trong hộ mình | Cho phép | Xử lý chuẩn | PASS |

---

### Tổng kết: 15 PASS | 2 FAIL

**Các validation đã hoạt động:**
- ✅ Mass Assignment protection (field whitelisting)
- ✅ System field blocking (status, householdId, roles)
- ✅ Password length validation
- ✅ Role-based access control
