# Báo cáo Kiểm thử: Quản lý Nhân khẩu - Toàn diện (Final)

### Chi tiết kịch bản kiểm thử (Happy Path + Exceptions + Security + Known Bugs)

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Thêm nhân khẩu vào hộ hợp lệ | Lưu thành công | Xử lý chuẩn | PASS |
| 2 | Trùng số `idCardNumber` | Thông báo "Số CCCD đã tồn tại" | Xử lý chuẩn | PASS |
| 3 | **[BUG-R-01]** Xóa nhân khẩu đang là Chủ hộ | Chặn xóa để bảo vệ tính toàn vẹn | **Xử lý sai (Xóa mất chủ hộ)** | FAIL |
| 4 | **[BUG-R-02]** Tìm kiếm tên không phân biệt hoa thường | Trả về kết quả chính xác | Xử lý chuẩn | PASS |
| 5 | **[IDOR]** Cư dân A gọi API xem chi tiết Cư dân B | Trả về 403 Forbidden | **Không xử lý (Xem lén được)** | FAIL |
| 6 | Nhập tên nhân khẩu 1000 ký tự | Chặn độ dài | **Không xử lý (Lỗi UI)** | FAIL |
| 7 | Ngày sinh (`dateOfBirth`) nhập `01/01/2099` | Báo lỗi ngày trong tương lai | **Không xử lý** | FAIL |
| 8 | Giới tính nhập giá trị không xác định | Báo lỗi hoặc chọn mặc định | **Không xử lý** | FAIL |
| 9 | Stored XSS: Tên nhân khẩu chứa mã đánh cắp cookie | Chặn thực thi Script | **Không xử lý (Admin bị hack)** | FAIL |
| 10 | Type Juggling: `householdId` truyền mảng `[1]` | Báo lỗi định dạng | **Xử lý sai (Crash server)** | FAIL |
| 11 | Tìm kiếm với tên: `%` | Chặn hoặc xử lý wildcard đúng | Trả về toàn bộ DB | FAIL |
| 12 | Xóa ID nhân khẩu không tồn tại | Thông báo 404 | Xử lý chuẩn | PASS |

---
**Kết luận:** Xóa nhân khẩu chủ hộ là lỗi logic nặng nhất cần xử lý ngay bằng cách yêu cầu chuyển quyền chủ hộ trước khi xóa.
