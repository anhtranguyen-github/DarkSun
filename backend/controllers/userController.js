// controllers/userController.js
const { User, Role, Household } = require('../models');
const { Op } = require('sequelize');
/**
 * GET: Lấy danh sách tất cả người dùng, bao gồm cả vai trò của họ.
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['fullName', 'ASC']],
      // Chỉ lấy các trường cần thiết, không gửi mật khẩu về frontend
      attributes: ['id', 'username', 'fullName', 'email', 'status'],
      include: {
        model: Role,
        attributes: ['name'],
        through: { attributes: [] } // Không lấy thông tin từ bảng trung gian
      }
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

/**
 * PATCH: Cập nhật trạng thái người dùng (Khóa/Mở khóa)
 */
exports.updateUserStatus = async (req, res) => {
  try {
     // Lấy các tham số truy vấn từ URL (ví dụ: /users?username=test&status=active)
    const { username, fullName, roleId, status } = req.query;

    // Xây dựng điều kiện lọc động
    const whereClause = {};
    const includeOptions = {
      model: Role,
      attributes: ['name'],
      through: { attributes: [] }
    };

    if (username) {
      // Dùng Op.iLike để tìm kiếm không phân biệt hoa thường và chứa chuỗi
      whereClause.username = { [Op.iLike]: `%${username}%` };
    }
    if (fullName) {
      whereClause.fullName = { [Op.iLike]: `%${fullName}%` };
    }
    if (status) {
      whereClause.status = status;
    }

    // Nếu có lọc theo vai trò, thêm điều kiện vào phần include
    if (roleId) {
      includeOptions.where = { id: roleId };
    }

    const users = await User.findAll({
      where: whereClause, // Áp dụng điều kiện lọc cho bảng User
      include: includeOptions, // Áp dụng điều kiện lọc cho bảng Role
      order: [['fullName', 'ASC']],
      attributes: ['id', 'username', 'fullName', 'email', 'status'],
    });

    res.status(200).json({ success: true, data: users });
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

        // Luồng thay thế UC017: Kiểm tra vai trò quản trị
        const userRoles = user.Roles.map(role => role.name);
        const adminRoles = ['Admin', 'Tổ trưởng', 'Tổ phó'];
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
    const isActorAdmin = actor.roles.includes('Admin');
    
    // Nếu người thực hiện KHÔNG PHẢI LÀ ADMIN, chúng ta cần kiểm tra thêm
    if (!isActorAdmin) {
      // Định nghĩa các vai trò mà Tổ trưởng/Tổ phó được phép gán
      const allowedRolesToAssign = ['Tổ trưởng', 'Tổ phó', 'Cư dân'];

      // Nếu vai trò sắp được gán không nằm trong danh sách cho phép, từ chối.
      if (!allowedRolesToAssign.includes(roleToAssign.name)) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền gán vai trò này.' });
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