import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Info, CheckCircle2 } from 'lucide-react';

const EksekusiPromo = () => {
    const navigate = useNavigate();
    const [diskon, setDiskon] = useState(30); // Default diskon 30%
    const [isSuccess, setIsSuccess] = useState(false);

    // Data dummy bahan yang dipilih dari Dashboard
    const itemKritis = {
        nama: "Tomat Segar",
        sisa: "5 kg",
        potensiRugi: "Rp 125.000",
        menuRekomendasi: "Jus Tomat & Salad"
    };

    const handleTerapkan = () => {
        setIsSuccess(true);
        // Simulasi loading/sukses sebelum kembali ke dashboard
        setTimeout(() => {
            navigate('/dashboard');
        }, 2500);
    };

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto relative">

            {/* Header dengan tombol kembali */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Tindakan Cepat</h2>
            </div>

            {/* Kartu Informasi Bahan & Potensi Rugi */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full mb-2 inline-block">Bahan Kritis</span>
                        <h3 className="text-xl font-bold text-gray-800">{itemKritis.nama}</h3>
                        <p className="text-gray-500 text-sm mt-1">Sisa Stok: {itemKritis.sisa}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-center">
                        <p className="text-xs text-red-500 font-bold mb-1">Potensi Rugi</p>
                        <p className="font-bold text-red-700">{itemKritis.potensiRugi}</p>
                    </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start border border-blue-100">
                    <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800 font-medium">
                        Sistem merekomendasikan pembuatan promo Flash Sale untuk menu <span className="font-bold">"{itemKritis.menuRekomendasi}"</span> hari ini.
                    </p>
                </div>
            </div>

            {/* Form Pengaturan Diskon */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
                <label className="block text-gray-700 font-bold mb-4 flex items-center gap-2">
                    <Tag size={18} /> Atur Besaran Diskon
                </label>

                <div className="flex items-center gap-4 mb-8">
                    <input
                        type="range"
                        min="10"
                        max="70"
                        step="5"
                        value={diskon}
                        onChange={(e) => setDiskon(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1A361D]"
                    />
                    <div className="shrink-0 w-16 text-center">
                        <span className="text-2xl font-bold text-[#1A361D]">{diskon}%</span>
                    </div>
                </div>

                {/* Tombol Eksekusi Utama */}
                <button
                    onClick={handleTerapkan}
                    disabled={isSuccess}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex justify-center items-center gap-2 ${isSuccess ? 'bg-green-500 scale-95' : 'bg-[#1A361D] hover:bg-[#122614] hover:shadow-xl'
                        }`}
                >
                    {isSuccess ? (
                        <>
                            <CheckCircle2 size={24} className="animate-bounce" />
                            Promo Berhasil Diterapkan!
                        </>
                    ) : (
                        'Terapkan Flash Sale Sekarang!'
                    )}
                </button>
            </div>

            {/* Toast Notification Melayang (Hanya muncul jika sukses) */}
            {isSuccess && (
                <div className="absolute bottom-4 left-0 right-0 mx-auto w-11/12 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-2xl animate-fade-in flex items-center justify-between z-50">
                    <div className="flex items-center gap-3 text-sm font-medium">
                        <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Sinkronisasi ke sistem kasir berhasil...
                    </div>
                </div>
            )}

        </div>
    );
};

export default EksekusiPromo;