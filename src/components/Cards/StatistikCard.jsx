import React from 'react';

export const StatistikCard = ({ icon, title, value, colorClass }) => {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className={`${colorClass} mb-2`}>
                {icon}
            </div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    );
};