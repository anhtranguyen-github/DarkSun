# Báo cáo Kiểm thử: Quản lý Thu phí & Hóa đơn - Toàn diện (Final)

### Chi tiết kịch bản kiểm thử (Happy Path + Exceptions + Security + Known Bugs)

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Chạy tính năng "Tạo hóa đơn tự động" | Quét đúng số dân cư/diện tích để tạo bill | Xử lý chuẩn | PASS |
| 2 | **[BUG-INV-01]** Đổi tên loại phí sau đó tạo bill | Map đúng loại phí theo ID thay vì tên | **Xử lý sai (Lỗi map phí)** | FAIL |
| 3 | **[BUG-INV-02]** Ghi nhận thanh toán qua API trực tiếp | Kiểm tra tính tồn tại của Household | **Xử lý sai (Inject ID ma được)** | FAIL |
| 4 | Thanh toán hóa đơn đã 'paid' lần nữa | Thông báo lỗi đã thanh toán | **Xử lý sai (Ghi đè status)** | FAIL |
| 5 | **[IDOR]** Cư dân xem hóa đơn nhà khác qua URL | Chặn truy cập (403) | **Không xử lý (Xem lén được)** | FAIL |
| 6 | Nhập số tiền hóa đơn âm (`-500,000`) | Báo lỗi hoặc chặn | **Không xử lý (Được giảm nợ ảo)** | FAIL |
| 7 | Payment Method: Truyền giá trị lạ (`Bitcoin`) | Báo lỗi hoặc chọn mặc định | **Không xử lý** | FAIL |
| 8 | Ghi chú thanh toán (`notes`) chứa mã độc | Encode text | **Không xử lý (Stored XSS)** | FAIL |
| 9 | Race Condition: Nhấn "Thanh toán" 2 lần nhanh | Chỉ ghi nhận 1 lần duy nhất | Xử lý chuẩn (DB Lock) | PASS |
| 10 | Tạo đợt thu với ngày kết thúc < bắt đầu | Thông báo lỗi logic thời gian | **Không xử lý** | FAIL |
| 11 | Ghi nhận thanh toán khi token hết hạn | Chặn lại và yêu cầu Login | Xử lý chuẩn | PASS |
| 12 | Ghi chú (`notes`) dài 1MB | Chặn payload cực lớn | **Xử lý sai (Crash 500)** | FAIL |

---
**Kết luận:** Cần bổ sung lớp Validation cho số tiền (chỉ chấp nhận số dương) và Ownership Check để ngăn chặn cư dân xem hóa đơn của nhau.
