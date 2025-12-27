// frontend/src/hooks/useApiError.js
import { useCallback } from 'react';
import { useToast } from '../components/common/Toast';
import { parseApiError } from '../utils/errorHandler';

/**
 * Custom hook for handling API errors with toast notifications
 * @returns {Object} - Object containing handleError function
 */
export const useApiError = () => {
    const toast = useToast();

    /**
     * Handle API error and show toast notification
     * @param {Error} error - Axios error object
     * @param {Object} options - Additional options
     * @param {string} options.fallbackMessage - Fallback message if error parsing fails
     * @param {boolean} options.showToast - Whether to show toast (default: true)
     */
    const handleError = useCallback((error, options = {}) => {
        const { fallbackMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.', showToast = true } = options;

        // Use parsed error if available, otherwise parse it
        const parsedError = error.parsedError || parseApiError(error);

        if (showToast) {
            const toastType = parsedError.type || 'error';
            toast[toastType](parsedError.message || fallbackMessage, {
                title: parsedError.title,
                duration: parsedError.status >= 500 ? 7000 : 5000,
            });
        }

        return parsedError;
    }, [toast]);

    /**
     * Handle successful API response with toast notification
     * @param {string} message - Success message
     * @param {Object} options - Additional options
     */
    const handleSuccess = useCallback((message, options = {}) => {
        toast.success(message, options);
    }, [toast]);

    /**
     * Wrap an async function with error handling
     * @param {Function} asyncFn - Async function to wrap
     * @param {Object} options - Error handling options
     * @returns {Function} - Wrapped function
     */
    const withErrorHandling = useCallback((asyncFn, options = {}) => {
        return async (...args) => {
            try {
                return await asyncFn(...args);
            } catch (error) {
                handleError(error, options);
                throw error;
            }
        };
    }, [handleError]);

    return {
        handleError,
        handleSuccess,
        withErrorHandling,
        toast,
    };
};

export default useApiError;
