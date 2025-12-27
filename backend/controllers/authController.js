const { User, Role, sequelize } = require('../models');
const { comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');

exports.register = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { username, password, fullName, roleId } = req.body;

    if (!username || !password || !fullName || !roleId) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin, bao gồm cả vai trò.' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại.' });
    }

    const newUser = await User.create({ username, password, fullName }, { transaction: t });

    const role = await Role.findByPk(roleId);
    if (role) {
      await newUser.addRole(role, { transaction: t });
    } else {
      await t.rollback();
      return res.status(400).json({ message: 'Vai trò được chọn không hợp lệ.' });
    }

    await t.commit();

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      data: { id: newUser.id, username: newUser.username },
    });
  } catch (error) {
    await t.rollback();
    console.error('LỖI KHI ĐĂNG KÝ:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
      include: {
        model: Role,
        attributes: ['id', 'name'],
        through: { attributes: [] }
      }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }

    // Kiểm tra trạng thái người dùng
    if (user.status === 'locked') {
        return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.' });
    }
    if (user.status === 'deleted') {
        return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại.' });
    }
    
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }

    const roles = user.Roles.map(role => role.name);
    const payload = { id: user.id, username: user.username, roles: roles };
    const token = generateToken(payload);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: {
        token,
        user: { id: user.id, username: user.username, fullName: user.fullName, roles: roles },
      },
    });
  } catch (error) {
    console.error('LỖI KHI ĐĂNG NHẬP:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};