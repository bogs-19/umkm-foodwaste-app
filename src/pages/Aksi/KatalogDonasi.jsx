import React from 'react';
import { ArrowLeft, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KatalogDonasi = () => {
    const navigate = useNavigate();

    const riwayatDonasi = [
        { id: 1, bahan: "Sisa Nasi & Sayur", target: "Peternakan Lele Pak Budi", status: "Terkirim", tanggal: "23 Juni 2026" },
        { id: 2, bahan: "10 Roti Burger", target: "Panti Asuhan Kasih Bunda", status: "Terkirim", tanggal: "21 Juni 2026" },
    ];

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto pb-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Katalog Donasi</h2>
            </div>

            <button className="w-full mb-6 py-3 bg-[#A7D189] text-[#1A361D] rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#95C276] transition-colors">
                <HeartHandshake size={20} /> Tambah Mitra Donasi Baru
            </button>

            <div className="space-y-4">
                {riwayatDonasi.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-gray-800">{item.bahan}</h3>
                            <p className="text-xs text-gray-500 mt-1">Kepada: {item.target}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{item.tanggal}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <CheckCircle2 size={24} className="text-green-500 mb-1" />
                            <span className="text-xs text-green-600 font-bold">{item.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KatalogDonasi;