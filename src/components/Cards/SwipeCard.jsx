import React from 'react';

export const SwipeCard = ({ item }) => {
    // 1. Logika Badge Kiri (Waktu/Basi)
    const isMauBasi = item.sisaWaktu.includes('1 Hari') || item.sisaWaktu.includes('3 Hari');

    // 2. Logika Badge Kanan (Stok)
    const textStok = item.status === 'Aman' ? 'Stok Aman' : (item.status === 'Kurang' ? 'Stok Kurang' : 'Stok Kritis');
    const colorStok = item.status === 'Aman' ? 'bg-green-500' : (item.status === 'Kurang' ? 'bg-yellow-500' : 'bg-red-500');

    return (
        <div className="w-full h-full relative rounded-3xl overflow-hidden bg-white flex flex-col pointer-events-none select-none">

            {/* BADGE KIRI: Peringatan Mau Basi */}
            {isMauBasi && (
                <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 text-xs font-bold text-white bg-orange-500 rounded-full shadow-sm border border-orange-400 animate-pulse">
                        Mau Basi!
                    </span>
                </div>
            )}

            {/* BADGE KANAN: Status Stok */}
            <div className="absolute top-4 right-4 z-20">
                <span className={`px-3 py-1 text-xs font-bold text-white rounded-full shadow-sm ${colorStok}`}>
                    {textStok}
                </span>
            </div>

            {/* Area Gambar */}
            <div className="w-full h-[55%] bg-gray-100 relative">
                <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent"></div>
            </div>

            {/* Area Teks */}
            <div className="flex-1 p-6 flex flex-col items-center justify-start text-center bg-white pt-4">
                <h3 className="text-5xl font-black text-[#0B1528] mb-4 tracking-tight">{item.nama}</h3>
                <p className="text-gray-500 font-medium text-lg">Sisa: <span className="font-bold text-[#1A361D]">{item.sisa}</span></p>
                <p className="text-sm text-gray-400 mt-2">Batas Waktu: {item.sisaWaktu}</p>
            </div>

        </div>
    );
};