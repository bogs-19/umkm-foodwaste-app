import React from 'react';
import { ArrowLeft, Tag, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dummyInventory } from '../../data/dummyInventory';

const RiwayatAksi = () => {
    const navigate = useNavigate();

    // Ambil data bahan yang butuh diselamatkan (Kritis)
    const bahanKritis = dummyInventory.filter(item => item.status === 'Kritis');

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto pb-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Bahan Butuh Promo</h2>
            </div>

            <div className="mb-4 bg-yellow-50 p-4 rounded-xl border border-yellow-200 flex items-start gap-3">
                <AlertTriangle size={24} className="text-yellow-600 shrink-0" />
                <p className="text-sm text-yellow-800 font-medium">
                    Pilih bahan di bawah ini untuk membuat poster Flash Sale secara manual dan sinkronisasi ke sistem kasir.
                </p>
            </div>

            <div className="space-y-4">
                {bahanKritis.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => navigate(`/eksekusi-promo/${item.id}`)} // <-- Lempar ID Bahan
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-[#A7D189] hover:shadow-md transition-all group"
                    >
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                            <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#1A361D] transition-colors">{item.nama}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md font-bold">Sisa: {item.sisaWaktu}</span>
                                <span className="text-xs text-gray-500">Stok: {item.sisa}</span>
                            </div>
                        </div>

                        <ChevronRight size={24} className="text-gray-300 group-hover:text-[#1A361D] transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RiwayatAksi;