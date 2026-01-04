# Báo cáo Kiểm thử: Quản lý Hộ khẩu - Toàn diện (Final)

### Chi tiết kịch bản kiểm thử (Happy Path + Exceptions + Security + Known Bugs)

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Tạo hộ hợp lệ (Mã hộ mới + Chủ hộ mới) | Lưu thành công 1 Hộ, 1 Nhân khẩu | Xử lý chuẩn | PASS |
| 2 | Trùng `householdCode` | Thông báo "Mã hộ khẩu đã tồn tại" | Xử lý chuẩn | PASS |
| 3 | **[BUG-H-02]** Tạo hộ với địa chỉ rỗng | Báo lỗi thiếu địa chỉ | **Không xử lý (Lưu rỗng)** | FAIL |
| 4 | Trùng Số CCCD của chủ hộ | Thông báo "Số CCCD chủ hộ đã tồn tại" | Xử lý chuẩn | PASS |
| 5 | **[BUG-H-01]** Thay đổi chủ hộ mới | Set người mới làm chủ hộ & reset người cũ | **Xử lý sai (Người cũ vẫn là chủ hộ)** | FAIL |
| 6 | `area` nhập giá trị âm (`-100`) | Báo lỗi hoặc chặn | **Không xử lý** | FAIL |
| 7 | Tên chủ hộ chứa mã Script: `<script>alert(1)</script>` | Encode text khi hiển thị | **Không xử lý (Stored XSS)** | FAIL |
| 8 | Địa chỉ chứa thẻ `<iframe>` (Phishing) | Loại bỏ thẻ độc hại | **Không xử lý (Bị XSS)** | FAIL |
| 9 | Tìm kiếm theo địa chỉ: Payload cực dài | Chặn độ dài hoặc trả về 400 | **Xử lý sai (Slow query/DoS)** | FAIL |
| 10 | Đổi chủ hộ: Người mới không thuộc hộ đó | Thông báo lỗi liên quan | Xử lý chuẩn | PASS |
| 11 | Truy cập API sửa hộ khẩu: Quyền Cư dân | Thông báo "Không có quyền" (403) | Xử lý chuẩn | PASS |
| 12 | Composite address: Thiếu Phường/Quận | Trả về chuỗi địa chỉ không đầy đủ | **Không xử lý (Hiển thị xấu)** | FAIL |

---
**Kết luận:** Cần cập nhật hàm `changeOwner` để reset trạng thái của chủ hộ cũ và thêm các bước Sanitization cho các trường nhập liệu text.
