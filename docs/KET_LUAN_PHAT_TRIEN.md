# KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

## 1. Kết quả đạt được
Trong quá trình thực hiện bài tập lớn xây dựng hệ thống "Quản lý Chung cư BlueMoon (DarkSun)", nhóm đã hoàn thành các mục tiêu quan trọng sau:
*   **Xây dựng thành công kiến trúc hệ thống:** Kết hợp giữa Backend (Node.js/Express) và Frontend (React) theo mô hình hiện đại, đảm bảo hiệu năng và khả năng mở rộng.
*   **Hoàn thiện các nghiệp vụ cốt lõi:** Quản lý hộ khẩu, nhân khẩu, tạm trú/tạm vắng, và đặc biệt là hệ thống quản lý phương tiện được tích hợp sâu.
*   **Hệ thống tài chính tự động:** Xây dựng cơ chế tính phí thông minh dựa trên dữ liệu thực tế của hộ gia đình (số người, diện tích, số lượng xe), giúp giảm thiểu sai sót thủ công.
*   **Phân quyền chặt chẽ (RBAC):** Triển khai 4 cấp bậc vai trò (Admin, Manager, Accountant, Resident) với phạm vi dữ liệu và chức năng riêng biệt.
*   **Bảo mật và Kiểm thử:** Áp dụng các kỹ thuật chặn XSS, SQL Injection và xây dựng bộ kế hoạch kiểm thử (Test Plan) chi tiết với 126 kịch bản kiểm thử nghiệp vụ.
*   **Giao diện người dùng:** Thiết kế hiện đại, tinh giản và hỗ trợ đa thiết bị (Responsive).

## 2. Ưu điểm và Nhược điểm

### Ưu điểm
*   **Tính toàn vẹn dữ liệu:** Hệ thống xử lý tốt các ràng buộc khóa ngoại (ví dụ: không cho xóa hộ khẩu khi còn nợ phí hoặc còn nhân khẩu).
*   **Tự động hóa cao:** Quy trình tạo hóa đơn hàng loạt giúp tiết kiệm thời gian cho bộ phận kế toán.
*   **Tính minh bạch:** Cư dân có thể tự tra cứu lịch sử hóa đơn và thông tin hộ gia đình mình một cách nhanh chóng.
*   **Dễ triển khai:** Hỗ trợ Docker giúp cài đặt hệ thống chỉ với một câu lệnh duy nhất.

### Nhược điểm
*   **Bảo mật nâng cao:** Một số tính năng như chặn IDOR trên một vài endpoint phụ và cơ chế Rate Limiting (chặn spam) vẫn chưa được hoàn thiện triệt để.
*   **Giao diện chi tiết phương tiện:** Mặc dù Backend đã hỗ trợ đầy đủ, nhưng Frontend hiện mới chỉ dừng lại ở mức thống kê số lượng phương tiện, chưa có trang quản lý chi tiết từng xe.
*   **Khả năng tương tác:** Hệ thống chưa tích hợp thông báo qua Email hoặc SMS khi có hóa đơn mới.
*   **Hiệu năng dữ liệu lớn:** Việc xuất báo cáo PDF bằng Puppeteer có thể gặp tình trạng timeout nếu tập dữ liệu lên đến hàng chục nghìn bảng ghi.

## 3. Hướng phát triển trong tương lai
Để khắc phục các nhược điểm trên và nâng cao chất lượng dịch vụ, hệ thống hướng tới các nâng cấp sau:
*   **Hoàn thiện giao diện:** Bổ sung trang quản lý phương tiện chi tiết trên Frontend và trang quản lý hồ sơ cá nhân nâng cao cho cư dân.
*   **Tích hợp thanh toán trực tuyến:** Kết nối với các cổng thanh toán như VNPay, Momo để cư dân có thể thanh toán hóa đơn trực tiếp trên hệ thống.
*   **Hệ thống thông báo tự động:** Tích hợp Firebase hoặc SendGrid để gửi thông báo đẩy và email nhắc nợ phí hàng tháng.
*   **Tối ưu hóa bảo mật:** Sử dụng Redis để lưu trữ danh sách đen (Blacklist) các mã Token bị thu hồi và triển khai cơ chế Rate Limit chặt chẽ hơn.
*   **Ứng dụng di động:** Phát triển thêm phiên bản Mobile App (React Native) dành riêng cho cư dân để tăng tính tiện dụng.
*   **Xử lý dữ liệu lớn:** Chuyển đổi cơ chế xuất báo cáo sang các thư viện xử lý luồng (Stream) để hỗ trợ xuất dữ liệu lớn mà không gây treo server.
