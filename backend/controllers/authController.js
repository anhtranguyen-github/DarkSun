const { User, Role, sequelize } = require('../models');
const { comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');
const { sanitizeHtml, isValidUsername, isValidPassword, isValidName, isValidEmail } = require('../utils/validationUtils');

exports.register = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { username, password, fullName, email, roleId } = req.body;

    // FIXED: Validation
    if (!username || !password || !fullName || !roleId) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ.' });
    }

    // FIXED: Username validation (3-50 chars, alphanumeric)
    if (!isValidUsername(username)) {
      return res.status(400).json({ message: 'Tên đăng nhập phải từ 3-50 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới.' });
    }

    // FIXED: Password validation
    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Mật khẩu phải từ 6-100 ký tự.' });
    }

    // FIXED: FullName validation with sanitization
    if (!isValidName(fullName, 2, 100)) {
      return res.status(400).json({ message: 'Họ tên phải từ 2-100 ký tự.' });
    }

    // FIXED: Email format validation (if provided)
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ message: 'Email không đúng định dạng.' });
    }

    // Sanitize fullName
    const sanitizedFullName = sanitizeHtml(fullName);

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại.' });
    }

    const role = await Role.findByPk(roleId);
    if (!role) {
      await t.rollback();
      return res.status(400).json({ message: 'Vai trò không tồn tại.' });
    }

    // SECURITY CHECK: Public registration only allows 'resident'
    if (role.name !== 'resident') {
      await t.rollback();
      return res.status(403).json({
        message: 'Bạn chỉ có thể đăng ký tài khoản Cư Dân. Vui lòng liên hệ Admin để cấp quyền quản lý.'
      });
    }

    const newUser = await User.create({ username, password, fullName: sanitizedFullName, email }, { transaction: t });
    await newUser.addRole(role, { transaction: t });

    await t.commit();

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      data: { id: newUser.id, username: newUser.username },
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // FIXED: Type Juggling check
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Định dạng dữ liệu không hợp lệ.' });
    }

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

    // FIXED: Trạng thái người dùng
    if (user.status === 'locked') {
      return res.status(403).json({ success: false, message: 'Tài khoản của bạn đã bị khóa.' });
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
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};