# Báo cáo Sửa lỗi: Module Resident

**Cập nhật:** 2026-01-04

## Lỗi đã phát hiện và sửa

### BUG-RES-01: Delete Owner
- **Mô tả:** Cho phép xóa nhân khẩu đang là chủ hộ
- **Giải pháp:** Check `household.ownerId === resident.id` trước khi xóa
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-RES-02: Future Birth Date
- **Mô tả:** Cho phép nhập ngày sinh trong tương lai
- **Giải pháp:** `isValidBirthDate()` check <= now()
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-RES-03: Past Birth Date >150 Years (**MỚI**)
- **Mô tả:** Không chặn ngày sinh quá xa trong quá khứ
- **Giải pháp:** `isValidBirthDate()` check >= now - 150 years
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-RES-04: Invalid ID Card Format
- **Mô tả:** Chấp nhận số CCCD không đúng format
- **Giải pháp:** `isValidIdCard()` - regex `/^\d{9}$|^\d{12}$/`
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-RES-05: Name Length (**MỚI**)
- **Mô tả:** Không giới hạn độ dài tên (max 100)
- **Giải pháp:** `isValidName(fullName, 2, 100)`
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-RES-06: Gender Validation (**MỚI**)
- **Mô tả:** Chấp nhận giới tính không hợp lệ
- **Giải pháp:** `isValidGender()` - chỉ Nam/Nữ/Khác
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-RES-07: Field Length (**MỚI**)
- **Mô tả:** alias, ethnicity, religion không giới hạn
- **Giải pháp:** `isValidLength(field, 0, 50)`
- **Trạng thái:** ✅ ĐÃ SỬA

---

## File đã sửa:
- `backend/controllers/residentController.js`
- `backend/utils/validationUtils.js`
