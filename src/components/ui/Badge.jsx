import React from 'react';

export const Badge = ({ variant = 'success', children, className = '' }) => {
    const baseStyle = "px-3 py-1 text-xs font-bold rounded-full shadow-sm";

    const variants = {
        danger: "bg-red-500 text-white",
        success: "bg-green-500 text-white",
        warning: "bg-yellow-500 text-white",
        neutral: "bg-gray-200 text-gray-700"
    };

    return (
        <span className={`${baseStyle} ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};