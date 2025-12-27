const { verifyToken } = require('../utils/jwtUtils');
const { User } = require('../models');

// Middleware 1: Kiểm tra xem người dùng đã đăng nhập hay chưa (có token hợp lệ không)
exports.protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem header 'Authorization' có tồn tại và bắt đầu bằng 'Bearer' không
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token từ header (bỏ chữ 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // Xác thực token
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn.' });
      }

      // Gắn thông tin user (đã giải mã từ token) vào object req để các hàm sau có thể dùng
      req.user = decoded;

      next(); // Cho phép đi tiếp
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Xác thực thất bại, vui lòng đăng nhập lại.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Không có quyền truy cập, vui lòng đăng nhập.' });
  }
};

// Middleware 2: Kiểm tra xem người dùng có vai trò phù hợp không
// (...roles) là một mảng các vai trò được phép, vd: authorize('Admin', 'Kế toán')
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // req.user được tạo ra từ middleware "protect" ở trên
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ success: false, message: 'Thông tin xác thực không đầy đủ.' });
    }

    // Kiểm tra xem vai trò của người dùng có nằm trong danh sách vai trò được phép không
    const hasPermission = req.user.roles.some(role => roles.includes(role));

    if (!hasPermission) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện chức năng này.' });
    }

    next(); // Cho phép đi tiếp
  };
};