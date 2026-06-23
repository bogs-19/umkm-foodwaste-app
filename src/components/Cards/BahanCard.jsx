import React from 'react';

export const BahanCard = ({ item, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col cursor-pointer hover:shadow-lg transition-all"
        >
            <div className="h-32 w-full bg-gray-100 relative">
                <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover" />
                <span className={`absolute top-2 right-2 px-2 py-1 text-[10px] font-bold rounded-md text-white ${item.status === 'Kritis' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {item.sisaWaktu}
                </span>
            </div>
            <div className="p-3 flex flex-col flex-1">
                <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{item.nama}</h3>
                <p className="text-xs text-gray-500 mt-1 mt-auto">Sisa: <span className="font-semibold text-gray-700">{item.sisa}</span></p>
            </div>
        </div>
    );
};