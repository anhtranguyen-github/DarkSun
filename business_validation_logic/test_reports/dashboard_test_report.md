# Báo cáo Kiểm thử: Dashboard & Thống kê

**Cập nhật:** 2026-01-04 | **Phiên bản:** 2.1

### Chi tiết kịch bản kiểm thử

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Lấy thống kê mật độ dân cư | Trả về số liệu | Xử lý chuẩn | PASS |
| 2 | Lấy biểu đồ thu phí năm | Trả về 12 tháng | Xử lý chuẩn | PASS |
| 3 | Thống kê số lượng phương tiện | Trả về tổng | Xử lý chuẩn | PASS |
| 4 | Xem danh sách hộ nợ phí | Trả về unpaid | Xử lý chuẩn | PASS |
| 5 | Dữ liệu trống (hệ thống mới) | Hiển thị 0 | Xử lý chuẩn | PASS |
| 6 | **Dashboard: Quyền Kế toán** | Chỉ thấy tài chính | Xử lý chuẩn | **PASS** ✅ |
| 7 | **Dashboard: Quyền Cư dân** | Bị chặn 403 | Xử lý chuẩn | **PASS** ✅ |
| 8 | SQL Injection tham số năm | Không ảnh hưởng | Xử lý chuẩn | PASS |
| 9 | Thời gian vô lý | Trả về rỗng | Xử lý chuẩn | PASS |
| 10 | **Load Dashboard data lớn** | Parallel queries | Xử lý chuẩn | **PASS** ✅ |
| 11 | Xuất báo cáo Excel | File đúng định dạng | Xử lý chuẩn | PASS |
| 12 | **Xuất báo cáo PDF (Puppeteer)** | File PDF đúng nội dung | Xử lý chuẩn | **PASS** ✅ |
| 13 | **Lọc cư dân theo Nhóm tuổi** | <18, 18-35, 36-60, >60 | DATE_PART(AGE) check | **PASS** ✅ |
| 14 | **Lọc hộ khẩu theo Diện tích** | Đúng khoảng diện tích | Xử lý chuẩn | **PASS** ✅ |
| 15 | **Lọc hộ khẩu theo Số thành viên** | Đúng số lượng nhân khẩu | Xử lý chuẩn | **PASS** ✅ |
| 16 | Concurrent request nhiều | Race safe | Xử lý chuẩn | PASS |
| 17 | SQL Injection tham số `ageGroup` | Chặn, trả về rỗng | Xử lý chuẩn | PASS |
| 18 | Xuất PDF khi dữ liệu cực lớn | Timeout handling | Không xử lý | FAIL |

---

### Tổng kết: 16 PASS | 1 FAIL

**Các validation đã hoạt động:**
- ✅ Role-based data masking
- ✅ Parallel query optimization (Promise.all)
- ✅ Empty data handling
- ✅ **Age group calculation (DATE_PART/AGE)**
- ✅ **PDF Export using headless browser (Puppeteer)**
- ✅ SQL injection prevention
