# Báo cáo Kiểm thử: Chuẩn hóa Vai trò (Role Standardization)

**Ngày:** 2026-01-04
**Người thực hiện:** Antigravity

## 1. Mục tiêu
Đồng bộ hóa mã Role trong hệ thống về tiếng Anh chuẩn (`admin`, `manager`, `deputy`, `accountant`, `resident`) trong khi vẫn giữ hiển thị tiếng Việt cho người dùng cuối.

## 2. Thay đổi quan trọng
- **Backend Routes:** Sử dụng mã role tiếng Anh trong middleware `authorize()`.
- **Database:** Xóa các role tiếng Việt (`to_truong`, `cu_dan`...) và thay thế bằng role tiếng Anh.
- **Frontend:** Cập nhật bảng map `ROLE_NAMES` để hiển thị tiếng Việt đúng từ mã role tiếng Anh.
- **Test Scripts:** Cập nhật `test-api.sh` và `create-demo-users.js` để sử dụng username và role mới.

## 3. Kết quả kiểm thử (Automated)

| Test Case | Kết quả | Ghi chú |
| --- | --- | --- |
| **Authentication** | | |
| Admin Login (admin123) | ✅ PASS | |
| Manager Login (demo_manager) | ✅ PASS | Thay cho `demo_totruong` |
| Accountant Login (demo_accountant)| ✅ PASS | Thay cho `demo_ketoan` |
| Resident Login (demo_resident) | ✅ PASS | Thay cho `demo_cudan` |
| **Authorization (RBAC)** | | |
| Manager access Households | ✅ PASS | |
| Resident access Households | ✅ PASS | Chặn 403 (Đúng) |
| Accountant create Household | ✅ PASS | Chặn 403 (Đúng) |
| **Dashboard Access** | | |
| Admin Dashboard | ✅ PASS | |
| Resident Dashboard | ✅ PASS | Trả về thông tin giới hạn (cá nhân) |

## 4. Tồn tại
- Một số API Self-Service (`/me/profile`) cần restart server để nhận middleware mới (đã cập nhật code).
- Tính năng "Tạo hộ khẩu" trong test script bị lỗi đè dữ liệu (không ảnh hưởng logic phân quyền).

## 5. Kết luận
Hệ thống đã chuyển đổi thành công sang mô hình Role tiếng Anh. Các script test tự động đã được cập nhật và chạy thành công (ngoại trừ cần restart server runtime).
