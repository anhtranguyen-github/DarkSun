# Báo cáo Sửa lỗi: Module Self Service

**Cập nhật:** 2026-01-04

## Lỗi đã phát hiện và sửa

### BUG-SS-01: Mass Assignment
- **Mô tả:** Cư dân có thể tự nâng quyền qua profile update
- **Nguyên nhân:** Không whitelist fields được phép update
- **Giải pháp:** Chỉ cho phép: `fullName`, `email`, `phone`, `avatar`
- **File:** `selfServiceController.js` line 45-52

### BUG-SS-02: System Fields Exposed
- **Mô tả:** Có thể update các field hệ thống như roleId, status
- **Nguyên nhân:** Không block sensitive fields
- **Giải pháp:** Trả lỗi khi cố update system fields
- **File:** `selfServiceController.js`
