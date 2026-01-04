// controllers/userController.js
const { User, Role, Household } = require('../models');
const { Op } = require('sequelize');
const { sanitizeHtml, isValidUsername, isValidPassword, isValidName, isValidEmail } = require('../utils/validationUtils');
/**
 * GET: Lấy danh sách tất cả người dùng, bao gồm cả vai trò của họ.
 */
exports.getAllUsers = async (req, res) => {
  try {
    const isRequesterAdmin = req.user.roles.includes('admin');
    const users = await User.findAll({
      order: [['fullName', 'ASC']],
      attributes: ['id', 'username', 'fullName', 'email', 'status'],
      include: {
        model: Role,
        attributes: ['id', 'name'],
        through: { attributes: [] }
      }
    });

    // Post-processing filter: Hide Admins if requester is not Admin
    const filteredUsers = isRequesterAdmin
      ? users
      : users.filter(u => !u.Roles.some(r => r.name === 'admin'));

    res.status(200).json({ success: true, data: filteredUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * PATCH: Cập nhật trạng thái người dùng (Khóa/Mở khóa)
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findByPk(userId, {
      include: { model: Role }
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    // SECURITY: Check permissions
    const targetRoles = user.Roles.map(r => r.name.toLowerCase());
    const isTargetAdmin = targetRoles.includes('admin');
    const isActorAdmin = req.user.roles.includes('admin');

    if (isTargetAdmin) {
      if (!isActorAdmin) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền khóa tài khoản Admin.' });
      }

      // Last Admin Lockout Protection
      if (status !== 'active') {
        const adminCount = await User.count({
          include: [{ model: Role, where: { name: 'admin' } }],
          where: { status: 'active' }
        });
        if (adminCount <= 1 && user.status === 'active') {
          return res.status(403).json({ success: false, message: 'Không thể khóa Admin đang hoạt động duy nhất.' });
        }
      }
    }

    user.status = status;
    await user.save();

    res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * DELETE: Xóa mềm một người dùng (thay đổi trạng thái thành 'deleted')
 */
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (Number(userId) === req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không thể tự xóa chính mình.' });
    }

    const user = await User.findByPk(userId, {
      include: { model: Role, attributes: ['name'] }
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    // FIXED: Check for Last Admin Lockout
    const userRoles = user.Roles.map(role => role.name.toLowerCase());
    if (userRoles.includes('admin')) {
      // SECURITY: Prevent non-admin from deleting Admin
      if (!req.user.roles.includes('admin')) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa tài khoản Admin.' });
      }

      // Check for Last Admin Lockout
      const adminCount = await User.count({
        include: [{
          model: Role,
          where: { name: 'admin' }
        }],
        where: { status: { [Op.ne]: 'deleted' } }
      });
      if (adminCount <= 1) {
        return res.status(403).json({ success: false, message: 'Không thể xóa tài khoản Admin duy nhất của hệ thống.' });
      }
    }

    const adminRoles = ['manager', 'deputy'];
    if (userRoles.some(role => adminRoles.includes(role))) {
      return res.status(403).json({ success: false, message: 'Không thể xóa tài khoản có vai trò quản trị.' });
    }

    // Luồng thay thế UC017: Kiểm tra tài khoản đang được sử dụng
    const isOwner = await Household.findOne({ where: { ownerId: userId } });
    if (isOwner) {
      return res.status(400).json({ success: false, message: 'Không thể xóa người dùng này vì họ đang là chủ hộ. Vui lòng chuyển chủ hộ trước.' });
    }

    user.status = 'deleted';
    await user.save();

    res.status(200).json({ success: true, message: 'Xóa người dùng thành công.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * Gán một vai trò cho một người dùng.
 */
exports.assignRoleToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roleId } = req.body;

    // FIXED: Validation for roleId type
    if (!roleId || (typeof roleId !== 'number' && typeof roleId !== 'string')) {
      return res.status(400).json({ success: false, message: 'Vai trò không hợp lệ.' });
    }

    // Lấy thông tin về người đang thực hiện hành động từ token (đã được middleware `protect` thêm vào)
    const actor = req.user;

    // 1. Kiểm tra sự tồn tại của user và role
    const userToUpdate = await User.findByPk(userId);
    if (!userToUpdate) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    const roleToAssign = await Role.findByPk(roleId);
    if (!roleToAssign) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy vai trò này.' });
    }

    // 2. LOGIC PHÂN QUYỀN NÂNG CAO
    // Kiểm tra xem người thực hiện có phải là Admin hay không
    const isActorAdmin = actor.roles.includes('admin');

    // Nếu người thực hiện KHÔNG PHẢI LÀ ADMIN, chúng ta cần kiểm tra thêm
    if (!isActorAdmin) {
      // Định nghĩa các vai trò mà Tổ trưởng/Tổ phó được phép gán
      const allowedRolesToAssign = ['manager', 'deputy', 'resident'];

      // Nếu vai trò sắp được gán không nằm trong danh sách cho phép, từ chối.
      if (!allowedRolesToAssign.includes(roleToAssign.name.toLowerCase())) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền gán vai trò này.' });
      }

      // FIXED: Prevent staff from modifying other Admins
      const targetRoles = await userToUpdate.getRoles();
      if (targetRoles.some(r => r.name === 'admin')) {
        return res.status(403).json({ message: 'Chỉ Admin mới có quyền thao tác trên tài khoản Admin khác.' });
      }
    }

    // 3. Nếu vượt qua tất cả các bước kiểm tra, thực hiện gán vai trò
    await userToUpdate.addRole(roleToAssign);

    // Lấy lại thông tin user đầy đủ với các vai trò mới nhất để trả về cho frontend
    const updatedUserWithRoles = await User.findByPk(userId, {
      include: {
        model: Role,
        attributes: ['name'],
        through: { attributes: [] }
      }
    });

    res.status(200).json({
      success: true,
      message: `Đã gán thành công vai trò "${roleToAssign.name}" cho người dùng "${userToUpdate.username}".`,
      data: updatedUserWithRoles // Trả về user object đã được cập nhật
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server khi gán vai trò.', error: error.message });
  }
};

exports.assignHouseholdToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // Lấy householdId từ body, nó có thể là một số, chuỗi rỗng, hoặc null
    const { householdId } = req.body;

    // 1. Tìm người dùng cần cập nhật
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    // 2. Chuyển đổi giá trị nhận được thành giá trị hợp lệ cho CSDL
    // Nếu householdId được gửi lên và không phải là chuỗi rỗng, thì dùng nó.
    // Ngược lại, set thành null (để gỡ khỏi hộ khẩu).
    const newHouseholdId = householdId ? parseInt(householdId, 10) : null;

    // 3. Nếu gán vào một hộ khẩu mới, kiểm tra xem hộ khẩu đó có tồn tại không
    if (newHouseholdId !== null) {
      const household = await Household.findByPk(newHouseholdId);
      if (!household) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy hộ khẩu để gán.' });
      }
    }

    // 4. Sử dụng phương thức 'update' để cập nhật trực tiếp và an toàn
    await user.update({
      householdId: newHouseholdId
    });

    res.status(200).json({ success: true, message: 'Cập nhật hộ khẩu cho người dùng thành công.' });
  } catch (error) {
    console.error("LỖI KHI GÁN HỘ KHẨU:", error);
    res.status(500).json({ success: false, message: 'Lỗi server khi gán hộ khẩu.', error: error.message });
  }
};

/**
 * POST: Tạo người dùng mới (Dành cho Admin - Full Access)
 */
exports.createUser = async (req, res) => {
  try {
    const { username, password, fullName, email, roleId } = req.body;

    // Basic Validation
    if (!username || !password || !fullName || !roleId) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin: username, password, fullName, roleId.' });
    }

    if (!isValidUsername(username)) return res.status(400).json({ message: 'Tên đăng nhập không hợp lệ (3-50 ký tự, a-z0-9_).' });
    if (!isValidPassword(password)) return res.status(400).json({ message: 'Mật khẩu phải từ 6 ký tự.' });
    if (!isValidName(fullName)) return res.status(400).json({ message: 'Họ tên không hợp lệ.' });
    if (email && !isValidEmail(email)) return res.status(400).json({ message: 'Email không đúng định dạng.' });

    // Check duplicate user
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại.' });

    // Validate Role
    const role = await Role.findByPk(roleId);
    if (!role) return res.status(400).json({ message: 'Vai trò không tồn tại.' });

    // SECURITY: Prevent non-admin from creating Admin
    if (role.name === 'admin' && !req.user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Bạn không có quyền tạo tài khoản Admin.' });
    }

    // Sanitize
    const sanitizedFullName = sanitizeHtml(fullName);

    // Create User
    const newUser = await User.create({
      username,
      password,
      fullName: sanitizedFullName,
      email,
      status: 'active'
    });

    await newUser.addRole(role);

    res.status(201).json({
      success: true,
      message: `Tạo tài khoản ${username} thành công.`,
      data: {
        id: newUser.id,
        username: newUser.username,
        role: role.name
      }
    });

  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tạo người dùng.', error: error.message });
  }
};