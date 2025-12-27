// frontend/src/components/common/Toast.jsx
import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import './Toast.css';

// Create Toast Context
const ToastContext = createContext();

// Toast types with their icons and colors
const TOAST_TYPES = {
    success: {
        icon: '✓',
        title: 'Thành công',
    },
    error: {
        icon: '✕',
        title: 'Lỗi',
    },
    warning: {
        icon: '⚠',
        title: 'Cảnh báo',
    },
    info: {
        icon: 'ℹ',
        title: 'Thông báo',
    },
};

// Individual Toast Item
const ToastItem = ({ toast, onRemove }) => {
    const [isExiting, setIsExiting] = useState(false);
    const typeConfig = TOAST_TYPES[toast.type] || TOAST_TYPES.info;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onRemove(toast.id), 300);
        }, toast.duration || 5000);

        return () => clearTimeout(timer);
    }, [toast, onRemove]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 300);
    };

    return (
        <div className={`toast toast-${toast.type} ${isExiting ? 'toast-exit' : ''}`}>
            <div className="toast-icon">{typeConfig.icon}</div>
            <div className="toast-content">
                <div className="toast-title">{toast.title || typeConfig.title}</div>
                <div className="toast-message">{toast.message}</div>
            </div>
            <button className="toast-close" onClick={handleClose}>×</button>
        </div>
    );
};

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

// Toast Provider
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { ...toast, id }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // Helper functions for different toast types - memoized efficiently
    const toast = useMemo(() => ({
        success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
        error: (message, options = {}) => addToast({ type: 'error', message, ...options }),
        warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
        info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
    }), [addToast]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

// Hook to use toast
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastProvider;
