// frontend/src/utils/errorHandler.js

/**
 * HTTP Status Code to Vietnamese message mapping
 */
const HTTP_ERROR_MESSAGES = {
    // 4xx Client Errors
    400: {
        title: 'Yêu cầu không hợp lệ',
        defaultMessage: 'Dữ liệu gửi lên không đúng định dạng. Vui lòng kiểm tra lại.',
    },
    401: {
        title: 'Chưa xác thực',
        defaultMessage: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    },
    403: {
        title: 'Không có quyền truy cập',
        defaultMessage: 'Bạn không có quyền thực hiện thao tác này.',
    },
    404: {
        title: 'Không tìm thấy',
        defaultMessage: 'Dữ liệu yêu cầu không tồn tại hoặc đã bị xóa.',
    },
    405: {
        title: 'Phương thức không được phép',
        defaultMessage: 'Phương thức HTTP không được hỗ trợ cho endpoint này.',
    },
    408: {
        title: 'Hết thời gian chờ',
        defaultMessage: 'Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.',
    },
    409: {
        title: 'Xung đột dữ liệu',
        defaultMessage: 'Dữ liệu đã tồn tại hoặc đang bị xung đột. Vui lòng kiểm tra lại.',
    },
    413: {
        title: 'Dữ liệu quá lớn',
        defaultMessage: 'File hoặc dữ liệu gửi lên vượt quá giới hạn cho phép.',
    },
    422: {
        title: 'Dữ liệu không hợp lệ',
        defaultMessage: 'Dữ liệu không đúng định dạng yêu cầu. Vui lòng kiểm tra lại.',
    },
    429: {
        title: 'Quá nhiều yêu cầu',
        defaultMessage: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi một lát rồi thử lại.',
    },

    // 5xx Server Errors
    500: {
        title: 'Lỗi máy chủ',
        defaultMessage: 'Đã xảy ra lỗi từ phía máy chủ. Vui lòng thử lại sau.',
    },
    501: {
        title: 'Chức năng chưa được hỗ trợ',
        defaultMessage: 'Chức năng này chưa được triển khai.',
    },
    502: {
        title: 'Lỗi cổng kết nối',
        defaultMessage: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
    },
    503: {
        title: 'Dịch vụ không khả dụng',
        defaultMessage: 'Máy chủ đang bảo trì hoặc quá tải. Vui lòng thử lại sau.',
    },
    504: {
        title: 'Hết thời gian chờ cổng',
        defaultMessage: 'Máy chủ không phản hồi kịp thời. Vui lòng thử lại sau.',
    },
};

/**
 * Network error messages
 */
const NETWORK_ERROR_MESSAGES = {
    ERR_NETWORK: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
    ERR_CANCELED: 'Yêu cầu đã bị hủy.',
    ECONNABORTED: 'Kết nối đã bị gián đoạn. Vui lòng thử lại.',
    ERR_BAD_REQUEST: 'Yêu cầu không hợp lệ.',
    ERR_BAD_RESPONSE: 'Phản hồi từ máy chủ không hợp lệ.',
};

/**
 * Parse error response from API
 * @param {Error} error - Axios error object
 * @returns {Object} - Parsed error with title, message, and status
 */
export const parseApiError = (error) => {
    // Network errors (no response)
    if (!error.response) {
        const networkMessage = NETWORK_ERROR_MESSAGES[error.code] ||
            'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';

        return {
            status: 0,
            title: 'Lỗi kết nối',
            message: networkMessage,
            type: 'error',
        };
    }

    const { status, data } = error.response;
    const errorConfig = HTTP_ERROR_MESSAGES[status] || HTTP_ERROR_MESSAGES[500];

    // Try to get message from server response first
    let message = errorConfig.defaultMessage;

    if (data) {
        // Handle different response formats
        if (typeof data === 'string') {
            message = data;
        } else if (data.message) {
            message = data.message;
        } else if (data.error) {
            message = typeof data.error === 'string' ? data.error : data.error.message || message;
        } else if (data.errors && Array.isArray(data.errors)) {
            message = data.errors.map(e => e.message || e).join('. ');
        }
    }

    return {
        status,
        title: errorConfig.title,
        message,
        type: status >= 500 ? 'error' : status >= 400 ? 'warning' : 'error',
    };
};

/**
 * Get user-friendly error message
 * @param {Error} error - Error object
 * @returns {string} - User-friendly message in Vietnamese
 */
export const getErrorMessage = (error) => {
    const parsed = parseApiError(error);
    return parsed.message;
};

/**
 * Check if error is authentication error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
    return error.response?.status === 401;
};

/**
 * Check if error is permission error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isPermissionError = (error) => {
    return error.response?.status === 403;
};

/**
 * Check if error is network error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
    return !error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error');
};

export default {
    parseApiError,
    getErrorMessage,
    isAuthError,
    isPermissionError,
    isNetworkError,
};
