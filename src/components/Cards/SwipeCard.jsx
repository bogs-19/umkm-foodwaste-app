import React from 'react';

export const SwipeCard = ({ item }) => {
    return (
        <div className="w-[300px] h-[400px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col cursor-grab active:cursor-grabbing">
            <div className="h-[60%] w-full bg-gray-200 relative">
                <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover pointer-events-none" />
                <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full text-white shadow-sm ${item.status === 'Kritis' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {item.status}
                </span>
            </div>
            <div className="p-6 flex flex-col justify-center flex-1 text-center bg-white pointer-events-none">
                <h3 className="text-2xl font-bold text-gray-800">{item.nama}</h3>
                <p className="text-gray-500 mt-2 font-medium">Sisa: {item.sisa}</p>
            </div>
        </div>
    );
};