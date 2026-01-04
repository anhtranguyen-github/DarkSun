# Báo cáo Kiểm thử: Quản lý Loại phí (Fee Category)

### Chi tiết kịch bản kiểm thử (Happy Path + Exceptions + Security)

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Tạo loại phí mới (Tên, Đơn vị) | Lưu thành công | Xử lý chuẩn | PASS |
| 2 | Để trống tên loại phí | Thông báo yêu cầu nhập tên | **Không xử lý (Lỗi DB Null)** | FAIL |
| 3 | Tên loại phí trùng lặp | Thông báo lỗi đã tồn tại | Xử lý chuẩn | PASS |
| 4 | Đơn vị nhập chuỗi rỗng `""` | Báo lỗi hoặc không cho lưu | **Không xử lý (Lưu rỗng)** | FAIL |
| 5 | Xóa loại phí đang được gán vào Đợt thu | Chặn xóa để bảo vệ dữ liệu | **Không xử lý (Lỗi Integrity)** | FAIL |
| 6 | Cập nhật loại phí: Đổi tên thành rỗng | Chặn cập nhật | **Không xử lý** | FAIL |
| 7 | Tên loại phí chứa ký tự đặc biệt | Tự động làm sạch | **Không xử lý** | FAIL |
| 8 | SQL Injection qua filter tên phí | Chặn tấn công | Xử lý chuẩn (ORM) | PASS |

---
**Kết luận:** Chức năng này còn sơ sài về khâu validation nội dung (rỗng, ký tự đặc biệt).
