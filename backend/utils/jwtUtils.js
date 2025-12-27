const jwt = require('jsonwebtoken');

/**
 * Tạo một JSON Web Token
 * @param {object} payload - Dữ liệu muốn lưu trong token (vd: { id, username })
 * @returns {string} - Chuỗi token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

/**
 * Xác thực một token
 * @param {string} token - Chuỗi token
 * @returns {object | null} - Payload đã giải mã hoặc null nếu token không hợp lệ
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};