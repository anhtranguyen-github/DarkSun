# Báo cáo Kiểm thử: Quản lý Phương tiện (Vehicle)

### Chi tiết kịch bản kiểm thử

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Đăng ký xe mới với dữ liệu hợp lệ | Lưu thành công, link đúng `householdId` | Xử lý chuẩn | PASS |
| 2 | Trùng biển số xe trong hệ thống | Thông báo "Biển số xe đã tồn tại..." | Xử lý chuẩn (Conflict 409) | PASS |
| 3 | Đăng ký xe cho hộ không tồn tại | Thông báo "Hộ khẩu không tồn tại" | Xử lý chuẩn | PASS |
| 4 | Thiếu loại xe (`type`) | Thông báo thiếu thông tin bắt buộc | Xử lý chuẩn | PASS |
| 5 | Lọc danh sách xe theo Loại xe (XeMay/Oto) | Trả về tập con chính xác | Xử lý chuẩn | PASS |
| 6 | Tìm kiếm biển số (không phân biệt hoa thường) | Trả về đúng xe | Xử lý chuẩn | PASS |
| 7 | Cập nhật thông tin xe không tồn tại | Thông báo "Không tìm thấy xe" | Xử lý chuẩn | PASS |
| 8 | Xóa xe thành công | Xóa bản ghi khỏi DB | Xử lý chuẩn | PASS |
| 9 | Biển số xe quá dài (> 50 ký tự) | Thông báo lỗi độ dài | Không xử lý | FAIL |
| 10 | Loại xe nhập giá trị lạ (vd: "MayBay") | Thông báo giá trị không hợp lệ | Không xử lý | FAIL |
| 11 | Lấy danh sách xe theo hộ (`GET /household/:id`) | Trả về list xe thuộc hộ đó | Xử lý chuẩn | PASS |
| 12 | Chèn đoạn mã Script vào trường "Màu xe" | Bị XSS | Không xử lý | FAIL |

---
**Ghi chú:** Module này hoạt động khá độc lập và ổn định, chủ yếu chỉ là CRUD cơ bản.
