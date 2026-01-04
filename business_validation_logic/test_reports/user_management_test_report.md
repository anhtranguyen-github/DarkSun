# Báo cáo Kiểm thử: Quản lý Người dùng & Phân quyền (User Management)

**Cập nhật:** 2026-01-04 | **Phiên bản:** 2.1

### Chi tiết kịch bản kiểm thử

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Admin xem danh sách người dùng | Trả về không có password | Xử lý chuẩn | PASS |
| 2 | IDOR: Resident lấy user khác | Chặn 403 | Không xử lý | FAIL |
| 3 | Cư dân sửa profile người khác | Chặn 403 | Xử lý chuẩn | PASS |
| 4 | Mass Assignment: Tự nâng quyền Admin | Chặn field roleId | Xử lý chuẩn | PASS |
| 5 | Xóa Admin duy nhất | Chặn "Admin duy nhất" | Xử lý chuẩn | PASS |
| 6 | Admin tự xóa chính mình | Chặn "Không thể tự xóa" | Xử lý chuẩn | PASS |
| 7 | Xóa user đang là chủ hộ | Chặn, yêu cầu chuyển chủ hộ | Xử lý chuẩn | PASS |
| 8 | Xóa user có vai trò to_truong | Chặn xóa vai trò quản trị | Xử lý chuẩn | PASS |
| 9 | Khóa tài khoản (`status: locked`) | User không thể đăng nhập | Xử lý chuẩn | PASS |
| 10 | Mở khóa tài khoản | Cho phép đăng nhập lại | Xử lý chuẩn | PASS |
| 11 | Truy cập không Token | 401 | Xử lý chuẩn | PASS |
| 12 | Token hợp lệ nhưng user deleted | Chặn | Xử lý chuẩn | PASS |
| 13 | Tổ trưởng sửa trạng thái Admin | Chặn | Xử lý chuẩn | PASS |
| 14 | Gán role không tồn tại | 404 | Xử lý chuẩn | PASS |
| 15 | Gán role cho user không tồn tại | 404 | Xử lý chuẩn | PASS |
| 16 | Tổ trưởng gán vai trò Admin | Chặn "Không có quyền gán" | Xử lý chuẩn | PASS |
| 17 | Gán hộ khẩu không tồn tại | 404 | Xử lý chuẩn | PASS |
| 18 | Gán householdId = null | Set null (gỡ hộ) | Xử lý chuẩn | PASS |
| 19 | Filter users theo username | iLike search | Xử lý chuẩn | PASS |
| 20 | Filter users theo roleId | Đúng users của role | Xử lý chuẩn | PASS |
| 21 | Password hash không leak | Không trả về password | Xử lý chuẩn | PASS |
| 22 | **Username chứa @#$%** | Chặn ký tự đặc biệt | Xử lý chuẩn | **PASS** ✅ |
| 23 | Email format validation | Validate định dạng | Không xử lý | FAIL |
| 24 | Soft delete: status = deleted | User không hiện trong list | Xử lý chuẩn | PASS |
| 25 | Reactivate deleted user | Đổi status về active | Xử lý chuẩn | PASS |

---

### Tổng kết: 23 PASS | 2 FAIL

**Các validation đã hoạt động:**
- ✅ Last Admin deletion protection
- ✅ Self-delete prevention
- ✅ Mass Assignment protection
- ✅ Role-based access control
- ✅ Username special characters validation
