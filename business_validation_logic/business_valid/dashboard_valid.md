# Business Validation: Dashboard

### Scenarios lọc chọn (Logic & Validation)

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 6 | **Dashboard: Quyền Kế toán** | Chỉ thấy tài chính | Xử lý chuẩn | **PASS** ✅ |
| 7 | **Dashboard: Quyền Cư dân** | Bị chặn 403 | Xử lý chuẩn | **PASS** ✅ |
| 8 | SQL Injection tham số năm | Không ảnh hưởng | Xử lý chuẩn | PASS |
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
*Ghi chú: Đã lọc từ dashboard_test_report.md dựa trên tiêu chí logic nghiệp vụ và ràng buộc hệ thống.*