import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';

const ToastContext = createContext();

const TOAST_STYLES = {
    success: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        text: 'text-emerald-400',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
            </svg>
        )
    },
    error: {
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        text: 'text-rose-400',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
            </svg>
        )
    },
    warning: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        text: 'text-amber-400',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        )
    },
    info: {
        bg: 'bg-primary-500/10',
        border: 'border-primary-500/20',
        text: 'text-primary-400',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    }
};

const ToastItem = ({ toast, onRemove }) => {
    const [isExiting, setIsExiting] = useState(false);
    const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => onRemove(toast.id), 300);
        }, 5000);
        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    return (
        <div className={`flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform ${isExiting ? 'opacity-0 translate-x-12 scale-95' : 'opacity-100 translate-x-0 scale-100'} ${style.bg} ${style.border} ${style.text}`}>
            <div className="shrink-0 pt-0.5">{style.icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-black uppercase tracking-widest leading-none mb-1 opacity-60">{toast.type}</p>
                <p className="text-sm font-bold leading-relaxed text-white">{toast.message}</p>
            </div>
            <button onClick={() => { setIsExiting(true); setTimeout(() => onRemove(toast.id), 300); }} className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { ...toast, id }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useMemo(() => ({
        success: (msg) => addToast({ type: 'success', message: msg }),
        error: (msg) => addToast({ type: 'error', message: msg }),
        warning: (msg) => addToast({ type: 'warning', message: msg }),
        info: (msg) => addToast({ type: 'info', message: msg }),
    }), [addToast]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 w-full max-w-sm">
                {toasts.map((t) => <ToastItem key={t.id} toast={t} onRemove={removeToast} />)}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
export default ToastProvider;
