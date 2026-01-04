# Báo cáo Kiểm thử: Dashboard & Thống kê

### Chi tiết kịch bản kiểm thử

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Lấy thống kê mật độ dân cư | Trả về số liệu theo hộ/tầng | Xử lý chuẩn | PASS |
| 2 | Lấy biểu đồ thu phí năm hiện tại | Trả về mảng 12 tháng dữ liệu | Xử lý chuẩn | PASS |
| 3 | Thống kê số lượng phương tiện | Trả về tổng số xe máy/oto | Xử lý chuẩn | PASS |
| 4 | Xem danh sách các hộ nợ phí | Trả về danh sách status 'unpaid' | Xử lý chuẩn | PASS |
| 5 | Dữ liệu đầu vào trống (Hệ thống mới) | Biểu đồ hiển thị 0 thay vì crash | Xử lý chuẩn | PASS |
| 6 | Truy cập Dashboard: Quyền Kế toán | Chỉ thấy thống kê tài chính | Xử lý sai (Thấy toàn bộ dashboard) | FAIL |
| 7 | Truy cập Dashboard: Quyền Cư dân | Bị chặn truy cập | Xử lý chuẩn | PASS |
| 8 | SQL Injection qua tham số lọc năm | Không bị ảnh hưởng | Xử lý chuẩn | PASS |
| 9 | Lọc thống kê theo khoảng thời gian vô lý | Trả về rỗng hoặc báo lỗi | Trả về rỗng | PASS |
| 10 | Tốc độ load Dashboard khi dữ liệu lớn | Phản hồi < 500ms | Load chậm (do lồng nhiều query) | FAIL |
| 11 | Xuất báo cáo Excel (nếu có) | File tải xuống đúng dữ liệu | N/A | PENDING |
| 12 | Hiển thị thông tin chủ hộ trên map | Click vào hộ hiện đúng popup | Xử lý chuẩn | PASS |

---
**Ghi chú:** Dashboard rất trực quan, tuy nhiên cần tối ưu query SQL (using views hoặc indexing) để tăng tốc độ load khi cư dân đông.
