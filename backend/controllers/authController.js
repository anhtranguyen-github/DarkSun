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

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body; // Frontend sends 'email' field but it can be username

    if (!email) {
      return res.status(400).json({ message: 'Vui lòng nhập Email hoặc Tên đăng nhập.' });
    }

    // Try to find by Email OR Username
    const { Op } = require('sequelize');
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { username: email }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
    }

    if (!user.email) {
      // CASE: User exists but has NO email -> Return flag to frontend
      return res.status(200).json({
        success: false,
        requireAdminVerify: true,
        allowManualReset: true,
        message: 'Tài khoản chưa cập nhật Email. Vui lòng nhập mật khẩu mới và chờ Admin xác nhận.'
      });
    }

    // CASE: User has email -> Send Link
    const resetToken = generateToken({ id: user.id, type: 'reset' }, '1h');

    console.log('===================================================');
    console.log(`[MOCK EMAIL] Password Reset Link for ${user.username}:`);
    console.log(`Token: ${resetToken}`);
    console.log('===================================================');

    res.status(200).json({
      success: true,
      requireAdminVerify: false,
      message: 'Link đặt lại mật khẩu đã được gửi đến email của bạn! (Check console)'
    });


  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Thiếu thông tin xác thực.' });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ message: 'Mật khẩu mới phải từ 6-100 ký tự.' });
    }

    // Verify token (reusing jwtUtils, might need specific verify if different secret)
    // Assuming generateToken uses a standard secret. 
    // We need to decode it.
    const jwt = require('jsonwebtoken'); // Need to require if not available globally
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.' });
    }

    if (decoded.type !== 'reset') {
      return res.status(401).json({ message: 'Token không hợp lệ.' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    // Update password
    user.password = newPassword; // Hook in model will hash it?
    // Let's manually hash to be safe if model hook doesn't run on simple assignment/save without hooks option
    // Actually User model usually has hooks. Let's force update.

    await user.update({ password: newPassword }, { transaction: t, individualHooks: true });

    await t.commit();
    res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.' });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

exports.requestManualReset = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
      return res.status(400).json({ message: 'Thiếu thông tin.' });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ message: 'Mật khẩu mới phải từ 6-100 ký tự.' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'Tài khoản không tồn tại.' });
    }

    // Check for existing pending request
    if (user.is_reset_pending) {
      return res.status(400).json({
        message: 'Bạn đã có yêu cầu đổi mật khẩu đang chờ duyệt. Vui lòng đợi Admin xử lý hoặc hủy yêu cầu cũ.'
      });
    }

    // Hash the new pending password
    const { hashPassword } = require('../utils/passwordUtils');
    const hashedPending = await hashPassword(newPassword);

    // Update user
    user.pending_password = hashedPending;
    user.is_reset_pending = true;

    await user.save({ transaction: t });
    await t.commit();

    res.status(200).json({
      success: true,
      message: 'Đã gửi yêu cầu đổi mật khẩu! Vui lòng chờ Admin xác nhận.'
    });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};