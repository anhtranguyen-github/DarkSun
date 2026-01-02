/**
 * Seed Script for Roles and Permissions
 * Creates the complete RBAC structure based on RBAC_PERMISSION_MATRIX.md
 * Includes: Admin, Tổ Trưởng, Tổ Phó, Kế Toán, Cư Dân
 */
require('dotenv').config();
const { Role, Permission, sequelize } = require('../models');

// Define all permissions based on the matrix
const PERMISSIONS = [
    // Nhóm Nhân Khẩu
    { code: 'nk:view', name: 'Xem nhân khẩu', groupName: 'nhan_khau' },
    { code: 'nk:create', name: 'Thêm nhân khẩu', groupName: 'nhan_khau' },
    { code: 'nk:update', name: 'Sửa nhân khẩu', groupName: 'nhan_khau' },
    { code: 'nk:delete', name: 'Xóa nhân khẩu', groupName: 'nhan_khau' },
    { code: 'nk:move', name: 'Chuyển khẩu', groupName: 'nhan_khau' },

    // Nhóm Hộ Khẩu
    { code: 'hk:view', name: 'Xem hộ khẩu', groupName: 'ho_khau' },
    { code: 'hk:create', name: 'Thêm hộ khẩu', groupName: 'ho_khau' },
    { code: 'hk:update', name: 'Sửa hộ khẩu', groupName: 'ho_khau' },
    { code: 'hk:delete', name: 'Xóa hộ khẩu', groupName: 'ho_khau' },
    { code: 'hk:change_owner', name: 'Đổi chủ hộ', groupName: 'ho_khau' },
    { code: 'hk:tach', name: 'Tách hộ khẩu', groupName: 'ho_khau' },

    // Nhóm Tạm Trú/Vắng
    { code: 'tt:view', name: 'Xem tạm trú/vắng', groupName: 'tam_tru' },
    { code: 'tt:register', name: 'Đăng ký tạm trú', groupName: 'tam_tru' },
    { code: 'tt:register_absence', name: 'Đăng ký tạm vắng', groupName: 'tam_tru' },
    { code: 'tt:approve', name: 'Duyệt đăng ký', groupName: 'tam_tru' },

    // Nhóm Phương Tiện
    { code: 'pt:view', name: 'Xem phương tiện', groupName: 'phuong_tien' },
    { code: 'pt:register', name: 'Đăng ký xe', groupName: 'phuong_tien' },
    { code: 'pt:update', name: 'Sửa thông tin xe', groupName: 'phuong_tien' },
    { code: 'pt:delete', name: 'Xóa xe', groupName: 'phuong_tien' },

    // Nhóm Thu Phí
    { code: 'phi:view', name: 'Xem loại phí', groupName: 'thu_phi' },
    { code: 'phi:config', name: 'Cấu hình phí', groupName: 'thu_phi' },
    { code: 'phi:create_period', name: 'Tạo đợt thu', groupName: 'thu_phi' },
    { code: 'phi:close_period', name: 'Đóng đợt thu', groupName: 'thu_phi' },

    // Nhóm Hóa Đơn
    { code: 'hd:view', name: 'Xem hóa đơn', groupName: 'hoa_don' },
    { code: 'hd:generate', name: 'Lập hóa đơn', groupName: 'hoa_don' },
    { code: 'hd:collect', name: 'Thu tiền', groupName: 'hoa_don' },
    { code: 'hd:cancel', name: 'Hủy hóa đơn', groupName: 'hoa_don' },
    { code: 'hd:export', name: 'Xuất hóa đơn', groupName: 'hoa_don' },

    // Nhóm Đóng Góp
    { code: 'dg:view', name: 'Xem đóng góp', groupName: 'dong_gop' },
    { code: 'dg:create_campaign', name: 'Tạo chiến dịch', groupName: 'dong_gop' },
    { code: 'dg:record', name: 'Ghi nhận đóng góp', groupName: 'dong_gop' },

    // Nhóm Thống Kê
    { code: 'tk:nhan_khau', name: 'TK nhân khẩu', groupName: 'thong_ke' },
    { code: 'tk:ho_khau', name: 'TK hộ khẩu', groupName: 'thong_ke' },
    { code: 'tk:thu_phi', name: 'TK thu phí', groupName: 'thong_ke' },
    { code: 'tk:export', name: 'Xuất báo cáo', groupName: 'thong_ke' },

    // Nhóm Quản Trị
    { code: 'sys:user_view', name: 'Xem người dùng', groupName: 'quan_tri' },
    { code: 'sys:user_manage', name: 'Quản lý người dùng', groupName: 'quan_tri' },
    { code: 'sys:role_assign', name: 'Gán vai trò', groupName: 'quan_tri' },
    { code: 'sys:audit_log', name: 'Xem nhật ký', groupName: 'quan_tri' },

    // Nhóm Self-Service (Cổng Cư Dân)
    { code: 'my:view_profile', name: 'Xem thông tin cá nhân', groupName: 'self_service' },
    { code: 'my:update_profile', name: 'Cập nhật liên hệ', groupName: 'self_service' },
    { code: 'my:view_invoices', name: 'Xem hóa đơn của tôi', groupName: 'self_service' },
    { code: 'my:view_payments', name: 'Xem lịch sử thanh toán', groupName: 'self_service' },
    { code: 'my:view_contributions', name: 'Xem đóng góp của tôi', groupName: 'self_service' },
];

// All self-service permissions
const SELF_SERVICE_PERMS = ['my:view_profile', 'my:update_profile', 'my:view_invoices', 'my:view_payments', 'my:view_contributions'];

// Define roles based on requirements
const ROLES = [
    {
        name: 'admin',
        displayName: 'Quản Trị Viên',
        description: 'Toàn quyền hệ thống',
        permissions: PERMISSIONS.map(p => p.code) // Admin has ALL permissions
    },
    {
        name: 'to_truong',
        displayName: 'Tổ Trưởng',
        description: 'Quản lý nhân khẩu, hộ khẩu',
        permissions: [
            'nk:view', 'nk:create', 'nk:update', 'nk:delete', 'nk:move',
            'hk:view', 'hk:create', 'hk:update', 'hk:delete', 'hk:change_owner', 'hk:tach',
            'tt:view', 'tt:register', 'tt:register_absence', 'tt:approve',
            'pt:view', 'pt:register', 'pt:update', 'pt:delete',
            'phi:view', 'hd:view', 'hd:export',
            'dg:view',
            'tk:nhan_khau', 'tk:ho_khau', 'tk:thu_phi', 'tk:export',
            'sys:audit_log',
            ...SELF_SERVICE_PERMS
        ]
    },
    {
        name: 'to_pho',
        displayName: 'Tổ Phó',
        description: 'Hỗ trợ Tổ Trưởng, không được xóa dữ liệu',
        permissions: [
            'nk:view', 'nk:create', 'nk:update', 'nk:move',
            'hk:view', 'hk:create', 'hk:update',
            'tt:view', 'tt:register', 'tt:register_absence',
            'pt:view', 'pt:register', 'pt:update',
            'phi:view', 'hd:view', 'hd:export',
            'dg:view',
            'tk:nhan_khau', 'tk:ho_khau', 'tk:thu_phi', 'tk:export',
            ...SELF_SERVICE_PERMS
        ]
    },
    {
        name: 'ke_toan',
        displayName: 'Kế Toán',
        description: 'Quản lý tài chính, thu phí',
        permissions: [
            'nk:view', 'hk:view', 'pt:view',
            'phi:view', 'phi:config', 'phi:create_period', 'phi:close_period',
            'hd:view', 'hd:generate', 'hd:collect', 'hd:export',
            'dg:view', 'dg:create_campaign', 'dg:record',
            'tk:thu_phi', 'tk:export',
            ...SELF_SERVICE_PERMS
        ]
    },
    {
        name: 'cu_dan',
        displayName: 'Cư Dân',
        description: 'Tra cứu thông tin cá nhân và hóa đơn',
        permissions: [
            'phi:view', // Can view fee types
            ...SELF_SERVICE_PERMS
        ]
    }
];

const seedRolesAndPermissions = async () => {
    const t = await sequelize.transaction();
    try {
        console.log('🔐 Seeding RBAC (Roles & Permissions)...\n');

        // 1. Seed Permissions
        console.log('=== PERMISSIONS ===');
        const permissionMap = {};
        for (const perm of PERMISSIONS) {
            const [record, created] = await Permission.findOrCreate({
                where: { code: perm.code },
                defaults: perm,
                transaction: t
            });
            permissionMap[perm.code] = record;
            if (created) {
                console.log(`   ✅ Created: ${perm.code}`);
            }
        }
        console.log(`   Total: ${PERMISSIONS.length} permissions\n`);

        // 2. Seed Roles
        console.log('=== ROLES ===');
        for (const roleDef of ROLES) {
            const [role, created] = await Role.findOrCreate({
                where: { name: roleDef.name },
                defaults: {
                    displayName: roleDef.displayName,
                    description: roleDef.description
                },
                transaction: t
            });

            if (created) {
                console.log(`   ✅ Created: ${roleDef.displayName}`);
            } else {
                console.log(`   ⏭️  Exists: ${roleDef.displayName}`);
            }

            // Assign permissions to role
            const permissionRecords = roleDef.permissions
                .map(code => permissionMap[code])
                .filter(Boolean);

            await role.setPermissions(permissionRecords, { transaction: t });
            console.log(`      → ${permissionRecords.length} permissions assigned`);
        }

        await t.commit();
        console.log('\n✅ RBAC seeding complete!');
        process.exit(0);
    } catch (error) {
        await t.rollback();
        console.error('❌ Error seeding RBAC:', error);
        process.exit(1);
    }
};

seedRolesAndPermissions();
