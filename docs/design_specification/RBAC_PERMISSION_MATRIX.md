# Hệ Thống Phân Quyền (RBAC) - BlueMoon Apartment Management

## Tổng Quan Hệ Thống

Hệ thống quản lý chung cư BlueMoon phục vụ công tác quản lý của **Ban Quản Trị** (BQT) tổ dân phố và cho phép **Cư dân** tự tra cứu thông tin của mình. Dựa trên đề bài, hệ thống hỗ trợ các nghiệp vụ chính:

1. **Quản lý nhân khẩu** (Hộ khẩu, Nhân khẩu, Tạm trú/Tạm vắng)
2. **Quản lý thu phí** (Phí bắt buộc, Đóng góp tự nguyện)
3. **Thống kê, báo cáo**
4. **Cổng thông tin cư dân** (Xem hóa đơn, thanh toán online)

---

## 1. Định Nghĩa Vai Trò (Roles)

| Mã Vai Trò | Tên Hiển Thị | Mô Tả Chức Năng |
|:-----------|:-------------|:----------------|
| `admin` | **Quản Trị Viên** | Toàn quyền hệ thống. Quản lý tài khoản người dùng, cấu hình hệ thống, sao lưu/phục hồi dữ liệu. |
| `to_truong` | **Tổ Trưởng** | Người đứng đầu BQT. Quản lý nhân khẩu/hộ khẩu, duyệt tạm trú/tạm vắng, xem toàn bộ báo cáo. |
| `to_pho` | **Tổ Phó** | Hỗ trợ Tổ Trưởng. Quyền tương tự Tổ Trưởng nhưng không được xóa dữ liệu. |
| `ke_toan` | **Kế Toán** | Quản lý tài chính. Thu phí, lập hóa đơn, quản lý các khoản đóng góp, xem thống kê tài chính. |
| `cu_dan` | **Cư Dân** | Tra cứu thông tin cá nhân. Xem hóa đơn của hộ mình, lịch sử đóng phí, thông tin đợt thu. |

> **Lưu ý:** 
> - Một người có thể được gán nhiều vai trò (ví dụ: vừa là Tổ Trưởng vừa là Kế Toán).
> - Cư dân được gán tự động khi tạo tài khoản và liên kết với hộ khẩu.

---

## 2. Danh Mục Quyền (Permissions)

### 2.1 Nhóm Quyền Nhân Khẩu

| Mã Quyền | Tên Quyền | Mô Tả |
|:---------|:----------|:------|
| `nk:view` | Xem nhân khẩu | Xem danh sách và chi tiết nhân khẩu |
| `nk:create` | Thêm nhân khẩu | Thêm mới nhân khẩu vào hộ |
| `nk:update` | Sửa nhân khẩu | Cập nhật thông tin nhân khẩu |
| `nk:delete` | Xóa nhân khẩu | Xóa nhân khẩu khỏi hệ thống |
| `nk:move` | Chuyển khẩu | Đăng ký chuyển đến/chuyển đi |

### 2.2 Nhóm Quyền Hộ Khẩu

| Mã Quyền | Tên Quyền | Mô Tả |
|:---------|:----------|:------|
| `hk:view` | Xem hộ khẩu | Xem danh sách và chi tiết hộ khẩu |
| `hk:create` | Thêm hộ khẩu | Tạo mới sổ hộ khẩu |
| `hk:update` | Sửa hộ khẩu | Cập nhật thông tin hộ |
| `hk:delete` | Xóa hộ khẩu | Xóa hộ khẩu khỏi hệ thống |
| `hk:change_owner` | Đổi chủ hộ | Thay đổi chủ hộ của sổ hộ khẩu |
| `hk:tach` | Tách hộ khẩu | Tách hộ khẩu thành nhiều hộ |

### 2.3 Nhóm Quyền Tạm Trú/Tạm Vắng

| Mã Quyền | Tên Quyền | Mô Tả |
|:---------|:----------|:------|
| `tt:view` | Xem tạm trú/vắng | Xem danh sách đăng ký tạm trú/vắng |
| `tt:register` | Đăng ký tạm trú | Đăng ký cư trú tạm thời |
| `tt:register_absence` | Đăng ký tạm vắng | Đăng ký vắng mặt tạm thời |
| `tt:approve` | Duyệt đăng ký | Phê duyệt đơn tạm trú/vắng |

### 2.4 Nhóm Quyền Phương Tiện

| Mã Quyền | Tên Quyền | Mô Tả |
|:---------|:----------|:------|
| `pt:view` | Xem phương tiện | Xem danh sách xe của hộ |
| `pt:register` | Đăng ký xe | Đăng ký xe mới cho hộ |
| `pt:update` | Sửa thông tin xe | Cập nhật biển số, màu sắc |
| `pt:delete` | Xóa xe | Hủy đăng ký xe |

### 2.5 Nhóm Quyền Thu Phí

| Mã Quyền | Tên Quyền | Mô Tả |
|:---------|:----------|:------|
| `phi:view` | Xem loại phí | Xem danh sách các loại phí |
| `phi:config` | Cấu hình phí | Tạo/sửa loại phí và đơn giá |
| `phi:create_period` | Tạo đợt thu | Mở đợt thu phí mới |
| `phi:close_period` | Đóng đợt thu | Kết thúc đợt thu phí |

### 2.6 Nhóm Quyền Hóa Đơn

| Mã Quyền | Tên Quyền | Mô Tả |
|:---------|:----------|:------|
| `hd:view` | Xem hóa đơn | Xem danh sách hóa đơn |
| `hd:generate` | Lập hóa đơn | Tạo hóa đơn hàng loạt cho đợt thu |
| `hd:collect` | Thu tiền | Ghi nhận thanh toán |
| `hd:cancel` | Hủy hóa đơn | Hủy hóa đơn đã tạo |
| `hd:export` | Xuất hóa đơn | Xuất PDF/Excel |

### 2.7 Nhóm Quyền Đóng Góp

| Mã Quyền | Tên Quyền | Mô Tả |
|:---------|:----------|:------|
| `dg:view` | Xem đóng góp | Xem danh sách chiến dịch và đóng góp |
| `dg:create_campaign` | Tạo chiến dịch | Tạo đợt vận động đóng góp |
| `dg:record` | Ghi nhận đóng góp | Ghi nhận khoản đóng góp của hộ |

### 2.8 Nhóm Quyền Thống Kê

| Mã Quyền | Tên Quyền | Mô Tả |
|:---------|:----------|:------|
| `tk:nhan_khau` | TK nhân khẩu | Xem thống kê biến động nhân khẩu |
| `tk:ho_khau` | TK hộ khẩu | Xem thống kê hộ khẩu |
| `tk:thu_phi` | TK thu phí | Xem thống kê doanh thu |
| `tk:export` | Xuất báo cáo | Xuất báo cáo PDF/Excel |

### 2.9 Nhóm Quyền Quản Trị

| Mã Quyền | Tên Quyền | Mô Tả |
|:---------|:----------|:------|
| `sys:user_view` | Xem người dùng | Xem danh sách tài khoản |
| `sys:user_manage` | Quản lý người dùng | Tạo/sửa/khóa tài khoản |
| `sys:role_assign` | Gán vai trò | Gán/thu hồi vai trò cho người dùng |
| `sys:audit_log` | Xem nhật ký | Xem lịch sử hoạt động hệ thống |

### 2.10 Nhóm Quyền Cổng Cư Dân (Self-Service)

| Mã Quyền | Tên Quyền | Mô Tả |
|:---------|:----------|:------|
| `my:view_profile` | Xem thông tin cá nhân | Xem thông tin của bản thân và hộ mình |
| `my:update_profile` | Cập nhật liên hệ | Cập nhật số điện thoại, email |
| `my:view_invoices` | Xem hóa đơn của tôi | Xem danh sách hóa đơn của hộ mình |
| `my:view_payments` | Xem lịch sử thanh toán | Xem lịch sử đóng phí |
| `my:view_contributions` | Xem đóng góp của tôi | Xem các khoản đóng góp của hộ mình |

---

## 3. Ma Trận Phân Quyền (Permission Matrix)

### 3.1 Quản Lý Nhân Khẩu & Hộ Khẩu

| Quyền | Admin | Tổ Trưởng | Tổ Phó | Kế Toán | Cư Dân |
|:------|:-----:|:---------:|:------:|:-------:|:------:|
| `nk:view` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `nk:create` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `nk:update` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `nk:delete` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `nk:move` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `hk:view` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `hk:create` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `hk:update` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `hk:delete` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `hk:change_owner` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `hk:tach` | ✅ | ✅ | ❌ | ❌ | ❌ |

### 3.2 Tạm Trú/Tạm Vắng & Phương Tiện

| Quyền | Admin | Tổ Trưởng | Tổ Phó | Kế Toán | Cư Dân |
|:------|:-----:|:---------:|:------:|:-------:|:------:|
| `tt:view` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `tt:register` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `tt:register_absence` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `tt:approve` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `pt:view` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `pt:register` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `pt:update` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `pt:delete` | ✅ | ✅ | ❌ | ❌ | ❌ |

### 3.3 Thu Phí & Hóa Đơn

| Quyền | Admin | Tổ Trưởng | Tổ Phó | Kế Toán | Cư Dân |
|:------|:-----:|:---------:|:------:|:-------:|:------:|
| `phi:view` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `phi:config` | ✅ | ❌ | ❌ | ✅ | ❌ |
| `phi:create_period` | ✅ | ❌ | ❌ | ✅ | ❌ |
| `phi:close_period` | ✅ | ❌ | ❌ | ✅ | ❌ |
| `hd:view` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `hd:generate` | ✅ | ❌ | ❌ | ✅ | ❌ |
| `hd:collect` | ✅ | ❌ | ❌ | ✅ | ❌ |
| `hd:cancel` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `hd:export` | ✅ | ✅ | ✅ | ✅ | ❌ |

### 3.4 Đóng Góp & Thống Kê

| Quyền | Admin | Tổ Trưởng | Tổ Phó | Kế Toán | Cư Dân |
|:------|:-----:|:---------:|:------:|:-------:|:------:|
| `dg:view` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `dg:create_campaign` | ✅ | ❌ | ❌ | ✅ | ❌ |
| `dg:record` | ✅ | ❌ | ❌ | ✅ | ❌ |
| `tk:nhan_khau` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `tk:ho_khau` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `tk:thu_phi` | ✅ | ✅ | ✅ | ✅ | ❌ |
| `tk:export` | ✅ | ✅ | ✅ | ✅ | ❌ |

### 3.5 Quản Trị Hệ Thống

| Quyền | Admin | Tổ Trưởng | Tổ Phó | Kế Toán | Cư Dân |
|:------|:-----:|:---------:|:------:|:-------:|:------:|
| `sys:user_view` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `sys:user_manage` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `sys:role_assign` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `sys:audit_log` | ✅ | ✅ | ❌ | ❌ | ❌ |

### 3.6 Cổng Cư Dân (Self-Service)

| Quyền | Admin | Tổ Trưởng | Tổ Phó | Kế Toán | Cư Dân |
|:------|:-----:|:---------:|:------:|:-------:|:------:|
| `my:view_profile` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `my:update_profile` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `my:view_invoices` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `my:view_payments` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `my:view_contributions` | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 4. Quy Tắc Kiểm Tra Quyền

### 4.1 Nguyên Tắc Chung
1. **Principle of Least Privilege:** Người dùng chỉ có quyền tối thiểu cần thiết.
2. **Role-Based:** Quyền được gán thông qua vai trò, không trực tiếp cho người dùng.
3. **Additive:** Nếu người dùng có nhiều vai trò, quyền được cộng dồn.
4. **Ownership-Based:** Quyền `my:*` chỉ áp dụng cho dữ liệu của chính người dùng/hộ.

### 4.2 Ưu Tiên Kiểm Tra
```
1. Xác thực (Authentication) - Có đăng nhập?
2. Phân quyền (Authorization) - Có quyền thực hiện hành động?
3. Sở hữu (Ownership) - Có quyền trên tài nguyên cụ thể? (đặc biệt cho my:*)
```

### 4.3 Ví Dụ Kiểm Tra

```javascript
// Kiểm tra quyền tạo hộ khẩu
function canCreateHousehold(user) {
    return user.hasAnyPermission(['hk:create']);
}

// Kiểm tra quyền thu tiền
function canCollectPayment(user) {
    return user.hasAnyPermission(['hd:collect']);
}

// Kiểm tra quyền xem hóa đơn của mình
function canViewMyInvoices(user, householdId) {
    // Admin/Staff can view all, Cư dân can only view their own
    if (user.hasAnyPermission(['hd:view'])) return true;
    if (user.hasAnyPermission(['my:view_invoices']) && user.householdId === householdId) return true;
    return false;
}
```

---

## 5. Cấu Trúc Dữ Liệu

### 5.1 Bảng `roles`
```sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,      -- 'admin', 'to_truong', 'to_pho', 'ke_toan', 'cu_dan'
    display_name VARCHAR(100) NOT NULL,    -- 'Quản Trị Viên', 'Tổ Trưởng'...
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 5.2 Bảng `permissions`
```sql
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,      -- 'nk:view', 'hk:create', 'my:view_invoices'...
    name VARCHAR(100) NOT NULL,            -- 'Xem nhân khẩu', 'Thêm hộ khẩu'...
    group_name VARCHAR(50),                -- 'nhan_khau', 'ho_khau', 'thu_phi', 'self_service'...
    description TEXT
);
```

### 5.3 Bảng `role_permissions`
```sql
CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(id),
    permission_id INTEGER REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);
```

### 5.4 Bảng `user_roles`
```sql
CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(id),
    role_id INTEGER REFERENCES roles(id),
    assigned_by INTEGER REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);
```

---

## 6. API Endpoint Mapping

### 6.1 Management APIs (BQT)

| Endpoint | Method | Quyền Yêu Cầu |
|:---------|:-------|:--------------|
| `/api/residents` | GET | `nk:view` |
| `/api/residents` | POST | `nk:create` |
| `/api/residents/:id` | PUT | `nk:update` |
| `/api/residents/:id` | DELETE | `nk:delete` |
| `/api/households` | GET | `hk:view` |
| `/api/households` | POST | `hk:create` |
| `/api/households/:id` | PUT | `hk:update` |
| `/api/households/:id` | DELETE | `hk:delete` |
| `/api/households/:id/change-owner` | PUT | `hk:change_owner` |
| `/api/temp-residences` | GET | `tt:view` |
| `/api/temp-residences` | POST | `tt:register` |
| `/api/vehicles` | GET | `pt:view` |
| `/api/vehicles` | POST | `pt:register` |
| `/api/vehicles/:id` | DELETE | `pt:delete` |
| `/api/fee-types` | GET | `phi:view` |
| `/api/fee-types` | POST | `phi:config` |
| `/api/fee-periods` | POST | `phi:create_period` |
| `/api/invoices` | GET | `hd:view` |
| `/api/invoices/generate/:periodId` | POST | `hd:generate` |
| `/api/invoices/:id/pay` | PUT | `hd:collect` |
| `/api/statistics/*` | GET | `tk:*` |
| `/api/users` | GET | `sys:user_view` |
| `/api/users` | POST | `sys:user_manage` |

### 6.2 Self-Service APIs (Cổng Cư Dân)

| Endpoint | Method | Quyền Yêu Cầu | Ghi chú |
|:---------|:-------|:--------------|:--------|
| `/api/me/profile` | GET | `my:view_profile` | Thông tin cá nhân + hộ khẩu |
| `/api/me/profile` | PUT | `my:update_profile` | Chỉ cập nhật SĐT, email |
| `/api/me/invoices` | GET | `my:view_invoices` | Hóa đơn của hộ mình |
| `/api/me/payments` | GET | `my:view_payments` | Lịch sử thanh toán |
| `/api/me/contributions` | GET | `my:view_contributions` | Đóng góp của hộ mình |
| `/api/fee-periods` | GET | `phi:view` | Xem danh sách đợt thu |
