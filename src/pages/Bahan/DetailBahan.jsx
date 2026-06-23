import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, AlertCircle } from 'lucide-react';
import { dummyInventory } from '../../data/dummyInventory';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/dateFormatter';

const DetailBahan = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Simulasi pengambilan data spesifik berdasarkan ID
    // Jika ID tidak ditemukan di URL, tampilkan bahan pertama sebagai default prototipe
    const bahan = dummyInventory.find(item => item.id === parseInt(id)) || dummyInventory[0];

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto pb-6">

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Detail Bahan</h2>
            </div>

            {/* Kartu Gambar & Status */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-6">
                <div className="h-56 w-full bg-gray-200 relative">
                    <img src={bahan.gambar} alt={bahan.nama} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4">
                        <Badge variant={bahan.status === 'Kritis' ? 'danger' : 'success'}>
                            {bahan.status}
                        </Badge>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">{bahan.nama}</h3>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <Package size={20} className="text-[#A7D189]" />
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-medium">Kuantitas Tersedia</span>
                                <span className="font-bold text-gray-800">{bahan.sisa}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <Calendar size={20} className="text-blue-400" />
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-medium">Batas Waktu FEFO</span>
                                <span className="font-bold text-gray-800">{bahan.sisaWaktu} <span className="text-xs font-normal text-gray-500">({formatDate(new Date())})</span></span>
                            </div>
                        </div>

                        {bahan.status === 'Kritis' && (
                            <div className="mt-4 bg-red-50 p-3 rounded-xl border border-red-100 flex items-start gap-2">
                                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700 font-medium">
                                    Bahan ini memerlukan tindakan cepat. Segera buat promo Flash Sale atau alokasikan untuk donasi.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DetailBahan;