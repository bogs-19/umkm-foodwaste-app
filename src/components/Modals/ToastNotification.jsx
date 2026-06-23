import React from 'react';

export const ToastNotification = ({ isVisible, message }) => {
    if (!isVisible) return null;

    return (
        <div className="absolute bottom-4 left-0 right-0 mx-auto w-11/12 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-2xl animate-fade-in flex items-center justify-between z-50">
            <div className="flex items-center gap-3 text-sm font-medium">
                <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                {message}
            </div>
        </div>
    );
};