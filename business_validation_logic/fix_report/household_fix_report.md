# Báo cáo Sửa lỗi: Module Household

**Cập nhật:** 2026-01-04

## Lỗi đã phát hiện và sửa

### BUG-HH-01: Change Owner Logic
- **Mô tả:** Khi đổi chủ hộ, người cũ vẫn giữ relationship "Chủ hộ"
- **Giải pháp:** Update relationship về "Thành viên" trong transaction
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-HH-02: Empty Address
- **Mô tả:** Cho phép tạo hộ với địa chỉ rỗng
- **Giải pháp:** Yêu cầu addressStreet, addressWard, addressDistrict
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-HH-03: Negative Area
- **Mô tả:** Cho phép nhập diện tích âm
- **Giải pháp:** Kiểm tra `area > 0 && area <= 10000`
- **Trạng thái:** ✅ ĐÃ SỬA

### BUG-HH-04: Delete Cascade Check (**MỚI**)
- **Mô tả:** Có thể xóa hộ khẩu còn nhân khẩu/xe/hóa đơn
- **Giải pháp:** Thêm `deleteHousehold()` với kiểm tra:
  - Resident count > 0 → chặn
  - Vehicle count > 0 → chặn
  - Unpaid invoice count > 0 → chặn
- **Trạng thái:** ✅ ĐÃ SỬA

---

## File đã sửa:
- `backend/controllers/householdController.js`
- `backend/utils/validationUtils.js`
