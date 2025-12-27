const bcrypt = require('bcryptjs');

/**
 * Mã hóa mật khẩu
 * @param {string} password - Mật khẩu gốc
 * @returns {Promise<string>} - Mật khẩu đã được hash
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * So sánh mật khẩu gốc với mật khẩu đã hash
 * @param {string} password - Mật khẩu người dùng nhập
 * @param {string} hashedPassword - Mật khẩu đã hash trong DB
 * @returns {Promise<boolean>} - True nếu khớp, False nếu không
 */
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};