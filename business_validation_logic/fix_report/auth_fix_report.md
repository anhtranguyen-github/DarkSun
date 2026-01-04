# Báo cáo Sửa lỗi: Module Auth

**Cập nhật:** 2026-01-04

## Lỗi đã phát hiện và sửa

### BUG-AUTH-01: Type Juggling
- **Mô tả:** Gửi password dạng array bypass validation
- **Giải pháp:** Check `typeof password !== 'string'`
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-AUTH-02: Privilege Escalation
- **Mô tả:** User có thể tự đăng ký với roleId Admin
- **Giải pháp:** Block `roleId === 1`
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-AUTH-03: Mass Assignment
- **Mô tả:** Có thể tự nâng quyền qua profile update
- **Giải pháp:** Field whitelisting trong update
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-AUTH-04: Username Length (**MỚI**)
- **Mô tả:** Không kiểm tra độ dài username (3-50 chars)
- **Giải pháp:** `isValidUsername()` - 3 đến 50 ký tự, alphanumeric + underscore
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-AUTH-05: Email Format (**MỚI**)
- **Mô tả:** Không kiểm tra định dạng email
- **Giải pháp:** `isValidEmail()` với regex
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-AUTH-06: FullName XSS (**MỚI**)
- **Mô tả:** Tên có thể chứa HTML tags
- **Giải pháp:** `sanitizeHtml()` loại bỏ tags
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-AUTH-07: FullName Length (**MỚI**)
- **Mô tả:** Không giới hạn độ dài tên
- **Giải pháp:** `isValidName(fullName, 2, 100)` - 2 đến 100 ký tự
- **Trạng thái:** ✅ ĐÃ SỬA

---

## File đã sửa:
- `backend/controllers/authController.js`
- `backend/utils/validationUtils.js` (MỚI)
