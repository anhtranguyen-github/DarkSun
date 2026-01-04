# Báo cáo Kiểm thử: Tạm trú & Tạm vắng (Temp Residence)

### Chi tiết kịch bản kiểm thử

| STT | Input | Output mong đợi | Exception | Kết quả |
| --- | --- | --- | --- | --- |
| 1 | Khai báo tạm trú cho cư dân hợp lệ | Lưu thành công | Xử lý chuẩn | PASS |
| 2 | Khai báo cho cư dân không tồn tại | Thông báo "Cư dân không tồn tại" | Xử lý chuẩn | PASS |
| 3 | Trùng mã giấy phép (`permitCode`) | Thông báo "Mã giấy phép đã tồn tại" | Xử lý chuẩn | PASS |
| 4 | Thiếu ngày bắt đầu (`startDate`) | Thông báo yêu cầu ngày bắt đầu | Xử lý chuẩn | PASS |
| 5 | Ngày kết thúc trước ngày bắt đầu | Thông báo lỗi logic thời gian | Không xử lý | FAIL |
| 6 | Tìm kiếm danh sách theo tên cư dân | Trả về các phiếu liên quan | Xử lý chuẩn | PASS |
| 7 | Lọc theo loại hình (Tạm trú/Tạm vắng) | Trả về đúng kết quả | Xử lý chuẩn | PASS |
| 8 | Địa chỉ tạm trú rỗng | Chấp nhận hoặc báo lỗi | Không xử lý (Cho phép lưu rỗng) | FAIL |
| 9 | Lý do khai báo quá dài | Thông báo lỗi độ dài | Không xử lý | FAIL |
| 10 | Truy xuất danh sách: Quyền cư dân | Chỉ xem được của bản thân | Hệ thống đang cho xem tất cả | FAIL |
| 11 | Nhập ngày tháng sai định dạng (vd: "abc") | Báo lỗi định dạng | Xử lý chuẩn (Sequelize) | PASS |
| 12 | Mã giấy phép chứa ký tự lạ | Tự động loại bỏ | Không xử lý | FAIL |

---
**Ghi chú:** Module này quan trọng trong quản lý an ninh, cần bổ sung kiểm tra logic thời hạn (startDate/endDate).
