# Báo cáo Kiểm thử: Quản lý Người dùng & Phân quyền (User Management)

**Cập nhật:** 2026-01-04 | **Phiên bản:** 2.2

### Chi tiết kịch bản kiểm thử

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Admin xem danh sách người dùng | Bao gồm cả Admins | Xử lý chuẩn | PASS |
| 2 | **Nhân viên xem danh sách user** | Ẩn quyền Admin khác | Data Masking | **PASS** ✅ |
| 3 | IDOR: Resident lấy user khác | Chặn 403 | Không xử lý | FAIL |
| 4 | Cư dân sửa profile người khác | Chặn 403 | Xử lý chuẩn | PASS |
| 5 | Mass Assignment: Tự nâng quyền Admin | Chặn field roleId | Xử lý chuẩn | PASS |
| 6 | **Xóa Admin duy nhất** | Chặn "Admin duy nhất" | Xử lý chuẩn | **PASS** ✅ |
| 7 | Admin tự xóa chính mình | Chặn "Không thể tự xóa" | Xử lý chuẩn | PASS |
| 8 | **Staff xóa Admin (Leo thang)** | Chặn 403 | Xử lý chuẩn | **PASS** ✅ |
| 9 | Xóa user đang là chủ hộ | Chặn, yêu cầu chuyển chủ hộ | Xử lý chuẩn | PASS |
| 10 | **Xóa vai trò quản trị (Manager/Deputy)** | Chặn xóa (Staff protection) | Xử lý chuẩn | **PASS** ✅ |
| 11 | Khóa tài khoản (`status: locked`) | User không thể đăng nhập | Xử lý chuẩn | PASS |
| 12 | Mở khóa tài khoản | Cho phép đăng nhập lại | Xử lý chuẩn | PASS |
| 13 | Token hợp lệ nhưng user deleted | Chặn | Xử lý chuẩn | PASS |
| 14 | **Tổ trưởng gán vai trò Admin** | Chặn "Không có quyền gán" | Xử lý chuẩn | **PASS** ✅ |
| 15 | Gán role không tồn tại | 404 | Xử lý chuẩn | PASS |
| 16 | **Gán householdId = null** | Gỡ user khỏi hộ khẩu | Xử lý chuẩn | **PASS** ✅ |
| 17 | **Search user (Case Insensitive)** | iLike search | Xử lý chuẩn | **PASS** ✅ |
| 18 | Password hash không leak | Không trả về password | Xử lý chuẩn | PASS |
| 19 | **Username chứa @#$%** | Chặn ký tự đặc biệt | Xử lý chuẩn | **PASS** ✅ |
| 20 | Soft delete: status = deleted | User không hiện trong list chính | Xử lý chuẩn | PASS |
| 21 | Reactivate deleted user | Đổi status về active | Xử lý chuẩn | PASS |

---

### Tổng kết: 20 PASS | 1 FAIL

**Các validation đã hoạt động:**
- ✅ Last Admin deletion protection
- ✅ Admin list masking for non-admins
- ✅ Staff role protection (Manager/Deputy deletion block)
- ✅ Self-delete & Cross-role deletion blocking
- ✅ Mass Assignment protection
- ✅ Household unlinking (Null assignment)
