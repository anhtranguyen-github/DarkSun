/**
 * Centralized Error Handling Middleware
 * 
 * This middleware catches all errors thrown in the application
 * and returns a consistent error response format.
 */

// Custom Error Class for API errors
class ApiError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational; // Distinguishes programmer errors from operational errors
        Error.captureStackTrace(this, this.constructor);
    }
}

// Not Found Handler (404)
const notFoundHandler = (req, res, next) => {
    const error = new ApiError(404, `Không tìm thấy route: ${req.originalUrl}`);
    next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Đã xảy ra lỗi không xác định.';

    // Handle specific Sequelize errors
    if (err.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = err.errors.map(e => e.message).join(', ');
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'Dữ liệu bị trùng lặp: ' + Object.keys(err.fields).join(', ');
    }

    if (err.name === 'SequelizeForeignKeyConstraintError') {
        statusCode = 400;
        message = 'Dữ liệu liên kết không tồn tại hoặc đang được sử dụng.';
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Token không hợp lệ.';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token đã hết hạn, vui lòng đăng nhập lại.';
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }

    // Send response
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Async Handler Wrapper (eliminates try-catch in every controller)
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    ApiError,
    notFoundHandler,
    errorHandler,
    asyncHandler
};
