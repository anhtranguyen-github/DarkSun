# Báo cáo Kiểm thử: Quản lý Loại phí (Fee Type)

**Cập nhật:** 2026-01-04 | **Phiên bản:** 2.1

### Chi tiết kịch bản kiểm thử

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Tạo loại phí hợp lệ | Lưu thành công | Xử lý chuẩn | PASS |
| 2 | **`name` trống** | Báo lỗi "không được để trống" | Xử lý chuẩn | **PASS** ✅ |
| 3 | **`name` chỉ có spaces** | Báo lỗi (trim + check) | Xử lý chuẩn | **PASS** ✅ |
| 4 | `name` dạng số | Chấp nhận | Xử lý chuẩn | PASS |
| 5 | Tên loại phí trùng | 409 | Xử lý chuẩn | PASS |
| 6 | **`unit` trống** | Báo lỗi "không được để trống" | Xử lý chuẩn | **PASS** ✅ |
| 7 | **`price` âm** | Báo lỗi "số dương" | Xử lý chuẩn | **PASS** ✅ |
| 8 | `price` = 0 | Chấp nhận (miễn phí) | Xử lý chuẩn | PASS |
| 9 | `price` là chuỗi "abc" | Báo lỗi NaN | Xử lý chuẩn | PASS |
| 10 | **Xóa loại phí trong PeriodFee** | Chặn, báo số lượng | Xử lý chuẩn | **PASS** ✅ |
| 11 | **Xóa loại phí trong InvoiceDetail** | Chặn | Xử lý chuẩn | **PASS** ✅ |
| 12 | Xóa loại phí không liên kết | Xóa thành công | Xử lý chuẩn | PASS |
| 13 | Update tên thành rỗng | Báo lỗi | Xử lý chuẩn | PASS |
| 14 | Update unit thành rỗng | Báo lỗi | Xử lý chuẩn | PASS |
| 15 | **XSS trong `name`** | Sanitize | Xử lý chuẩn | **PASS** ✅ |
| 16 | **XSS trong `unit`** | Sanitize | Xử lý chuẩn | **PASS** ✅ |
| 17 | SQL Injection filter | Chặn (ORM) | Xử lý chuẩn | PASS |
| 18 | Loại phí không tồn tại | 404 | Xử lý chuẩn | PASS |
| 19 | `category` = 'voluntary' | Lưu thành công | Xử lý chuẩn | PASS |
| 20 | **Thêm phí vào Đợt thu** | Lưu vào PeriodFee | Chặn trùng phí/đợt | **PASS** ✅ |
| 21 | **Sửa đơn giá phí trong Đợt** | Cập nhật amount | Xử lý chuẩn | **PASS** ✅ |
| 22 | **Xóa phí khỏi Đợt (đã có hóa đơn)** | **Chặn xóa** | Xử lý chuẩn | **PASS** ✅ |
| 23 | **Xóa phí khỏi Đợt (chưa hóa đơn)** | Cho phép xóa | Xử lý chuẩn | **PASS** ✅ |
| 24 | RBAC: Cu dan tạo fee type | 403 | Xử lý chuẩn | PASS |

---

### Tổng kết: 24 PASS | 0 FAIL

**Các validation đã hoạt động:**
- ✅ Name/Unit required validation
- ✅ Price >= 0 validation
- ✅ Dependency check (PeriodFee, InvoiceDetail)
- ✅ **PeriodFee overlap prevention (unique pair check)**
- ✅ **Blocking deletion of active PeriodFees (with Invoices)**
- ✅ XSS sanitization
