# BÁO CÁO KIỂM THỬ HỆ THỐNG QUẢN LÝ CHUNG CƯ BLUEMOON - TOÀN DIỆN

## 1. Tổng quan dự án
* **Tên hệ thống:** BlueMoon Apartment Management System
* **Mục tiêu:** Quản lý thông tin hộ khẩu, nhân khẩu, phí dịch vụ và hóa đơn cho chung cư cao cấp.
* **Đối tượng sử dụng:** Master Admin, Quản trị viên, Kế toán, Tổ trưởng/Tổ phó, Cư dân.

## 2. Phạm vi kiểm thử
Hệ thống được kiểm thử toàn diện trên các phương diện (Comprehensive Coverage):
* **Happy Path:** Các luồng nghiệp vụ chuẩn khi người dùng thao tác đúng.
* **Exceptional Cases:** Xử lý khi dữ liệu đầu vào trống, thiếu, sai định dạng hoặc mâu thuẫn logic.
* **Security & Hacker Simulation:** Kiểm thử khả năng chống tấn công SQL Injection, Stored XSS, leo thang đặc quyền (Privilege Escalation), và truy cập dữ liệu trái phép (IDOR).
* **System Stability:** Đánh giá độ bền khi gặp payload lớn hoặc các loại dữ liệu gây crash server (Type Juggling).

## 3. Thống kê kết quả kiểm thử (Tổng hợp từ 10 phân hệ)
| Thông số | Kết quả |
| :--- | :--- |
| **Tổng số chức năng** | 10 |
| **Tổng số Test Case thực hiện** | 120 |
| **Số Test Case Passed** | 82 |
| **Số Test Case Failed** | 38 |
| **Số Test Case Pending** | 0 |
| **Tỷ lệ thành công** | ~68% |

---

## 4. Danh sách các chức năng kiểm thử
1.  **F1: Đăng nhập & Xác thực:** Quản lý JWT, Session và phân quyền đăng nhập.
2.  **F2: Dashboard & Thống kê:** Hiển thị dữ liệu trực quan theo thời gian thực.
3.  **F3: Quản lý Hộ khẩu:** Quản lý thông tin căn hộ, diện tích, chủ hộ.
4.  **F4: Quản lý Nhân khẩu:** Quản lý thành viên, mối quan hệ chủ hộ.
5.  **F5: Quản lý Loại Phí:** Định nghĩa danh mục đơn giá (m2, đầu người, xe).
6.  **F6: Quản lý Đợt Thu:** Thiết lập kỳ hạn thu phí (tháng/năm).
7.  **F7: Quản lý Hóa đơn:** Tự động tính toán và khởi tạo hóa đơn hàng tuần/tháng.
8.  **F8: Quản lý Phương tiện:** Quản lý biển số xe, định danh chủ phương tiện.
9.  **F9: Tạm trú/Tạm vắng:** Khai báo cư trú tạm thời theo luật cư trú.
10. **F10: Cổng Cư dân (Self-Service):** Tiện ích tự tra cứu và cập nhật cá nhân.

---

## 5. Chi tiết Test Case tiêu biểu (Mẫu Hacker Simulation)

### Test Case Detail: Leo thang đặc quyền (Privilege Escalation)

| Field              | Value                              |
| ------------------ | ---------------------------------- |
| **Test No.**       | TC-AUTH-07                         |
| **Current Status** | ❌ Failed                          |
| **Title**          | Hacker tự gán quyền Admin khi đăng ký |
| **Description**    | Hacker gửi request đăng ký kèm `roleId: 1` để chiếm quyền quản trị |
| **Approach**       | Security Exploit / Hacker Simulation |

### Test Steps
| Step No. | Action | Purpose | Expected Result | Comment |
| -------- | ------ | ------- | --------------- | ------- |
| 1        | Mở công cụ cURL/Postman | Giả lập request API trực tiếp | Truy cập được API | |
| 2        | Gửi POST `/api/auth/register` kèm `roleId: 1` | Cố gắng bypass logic frontend | Hệ thống chặn hoặc gán role Default | **FAILED: Hệ thống gán quyền Admin** |
| 3        | Đăng nhập tài khoản vừa tạo | Kiểm tra đặc quyền thực tế | User không thể vào dashboard admin | **FAILED: Hacker đăng nhập Admin thành công** |

### Test Summary
| Field                 | Value                                             |
| --------------------- | ------------------------------------------------- |
| **Concluding Remark** | Lỗ hổng bảo mật nghiêm trọng (Mass Assignment).   |
| **Testing Team**      | Nhóm 23                                           |
| **Date Completed**    | 02/01/2026                                        |

---

## 6. Tổng hợp kết quả theo nhóm chức năng

| Chức năng | Số TC | Passed | Failed | Đánh giá |
| --------- | ----- | ------ | ------ | -------- |
| F1: Xác thực | 14 | 9 | 5 | Kém bảo mật (DoS/Mass Assign) |
| F3: Hộ khẩu | 12 | 8 | 4 | Tồn tại lỗi đổi chủ hộ & XSS |
| F4: Nhân khẩu | 12 | 7 | 5 | Lỗ hổng xóa chủ hộ & IDOR |
| F7: Hóa đơn | 12 | 8 | 4 | Lỗi thanh toán lặp & IDOR |
| **Tổng cộng** | **120** | **82** | **38** | **Cần khắc phục ngay** |

*Chi tiết từng bảng kiểm thử được trình bày trong thư mục `test_reports/`.*

---

## 7. Đánh giá yêu cầu phi chức năng

| Tiêu chí | Đánh giá | Ý nghĩa thực tế |
| :--- | :--- | :--- |
| **Tính bảo mật** | **Kém** | Dễ bị hacker tấn công qua API direct call (IDOR, XSS). |
| **Tính toàn vẹn** | **Tạm được** | Transaction hoạt động tốt nhưng thiếu logic ràng buộc nghiệp vụ (Business Integrity). |
| **Hiệu năng** | **Tốt** | Phản hồi API nhanh (< 100ms) dưới điều kiện tải nhẹ. |
| **Tính tiện dụng** | **Rất tốt** | Giao diện Dark-mode premium, trải nghiệm mượt mà. |

---

## 8. Kết luận và Khuyến nghị

### 8.1. Đánh giá tổng thể
Hệ thống "BlueMoon" đạt mức hoàn thiện cao về giao diện và luồng nghiệp vụ cơ bản (Happy Path). Tuy nhiên, bộ kiểm thử toàn năng (Comprehensive Suite) đã bộc lộ nhiều điểm yếu về khâu **xác thực dữ liệu (Input Validation)** và **phân quyền tầng đối tượng (Object-level Authorization)**.

### 8.2. Rủi ro còn tồn tại
1.  **Rủi ro tài chính:** Việc cho phép thanh toán lặp hoặc gửi số tiền âm có thể làm sai sót sổ sách kế toán.
2.  **Rủi ro pháp lý:** Lộ dữ liệu cá nhân (CCCD, SĐT) của cư dân qua IDOR.
3.  **Rủi ro vận hành:** Hacker có thể tự nâng quyền thành Admin để xóa sạch cơ sở dữ liệu.

### 8.3. Hướng phát triển (Next Actions)
- Triển khai **Ownership Middleware** để đảm bảo cư dân chỉ xem được dữ liệu của chính mình.
- Sử dụng thư viện **Zod/Joi** để validate chặt chẽ schema đầu vào ở mọi API route.
- Bổ sung **Rate Limiting** để chống tấn công Brute-force và DoS.

---
**Testing Team:** Nhóm 23
**Ngày hoàn tất:** 02/01/2026
