import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    className = '',
    ...props
}) => {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        danger: 'btn-danger'
    };

    return (
        <button
            className={`btn ${variants[variant]} ${className} ${loading ? 'shimmer' : ''}`}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <span className="spinner-sm"></span>
            ) : (
                <>
                    {icon && <span className="btn-icon">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
