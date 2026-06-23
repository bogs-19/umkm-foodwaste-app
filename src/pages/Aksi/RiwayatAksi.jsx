import React from 'react';
import { ArrowLeft, Tag, Clock, PlusCircle, ChevronRight } from 'lucide-react';
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

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Bahan Dipromosikan</h2>
            </div>

            {/* Tombol Buat Promo Baru */}
            <button
                onClick={() => navigate('/eksekusi-promo')}
                className="w-full mb-6 py-3 bg-[#1A361D] text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#122614] shadow-md transition-all"
            >
                <PlusCircle size={20} /> Buat Promo Flash Sale Baru
            </button>

            {/* List Kartu Promo */}
            <div className="space-y-4">
                {activePromos.map((promo) => (
                    <div
                        key={promo.id}
                        onClick={() => navigate('/eksekusi-promo')}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden cursor-pointer hover:border-[#A7D189] hover:shadow-md transition-all group"
                    >
                        {/* Pita Diskon (Ribbon) */}
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 group-hover:bg-red-600 transition-colors">
                            <Tag size={12} /> FLASH SALE {promo.diskon}
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mt-2 pr-8">{promo.menu}</h3>
                        <p className="text-sm text-gray-500 mb-4">Penyelamatan bahan: {promo.bahan}</p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[#1A361D] bg-green-50 px-3 py-2 rounded-lg text-sm font-semibold w-fit group-hover:bg-green-100 transition-colors">
                                <Clock size={16} /> Sisa Waktu: {promo.sisaWaktu}
                            </div>
                            <ChevronRight size={20} className="text-gray-400 group-hover:text-[#1A361D] transition-colors" />
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default RiwayatAksi;