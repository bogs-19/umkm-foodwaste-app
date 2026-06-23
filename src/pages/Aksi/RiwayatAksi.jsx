import React from 'react';
import { ArrowLeft, Tag, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RiwayatAksi = () => {
    const navigate = useNavigate();

    // Data Dummy Promo Aktif
    const activePromos = [
        { id: 1, menu: "Jus Tomat Segar", diskon: "30%", bahan: "Tomat", sisaWaktu: "08:45:12" },
        { id: 2, menu: "Beef Burger Extra", diskon: "20%", bahan: "Roti Burger", sisaWaktu: "12:30:00" },
    ];

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto pb-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Bahan Dipromosikan</h2>
            </div>

            <div className="space-y-4">
                {activePromos.map((promo) => (
                    <div key={promo.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        {/* Pita Diskon (Ribbon) */}
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                            <Tag size={12} /> FLASH SALE {promo.diskon}
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mt-2">{promo.menu}</h3>
                        <p className="text-sm text-gray-500 mb-4">Penyelamatan bahan: {promo.bahan}</p>

                        <div className="flex items-center gap-2 text-[#1A361D] bg-green-50 px-3 py-2 rounded-lg text-sm font-semibold w-fit">
                            <Clock size={16} /> Sisa Waktu: {promo.sisaWaktu}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RiwayatAksi;