import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, AlertCircle, Camera } from 'lucide-react';
import { dummyInventory } from '../../data/dummyInventory';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/dateFormatter';
import { ToastNotification } from '../../components/Modals/ToastNotification';

const DetailBahan = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [bahan, setBahan] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const savedInventory = localStorage.getItem('umkm_inventory');
        const inventoryData = savedInventory ? JSON.parse(savedInventory) : dummyInventory;
        const foundItem = inventoryData.find(item => item.id.toString() === id.toString());
        setBahan(foundItem);
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran gambar terlalu besar! Maksimal 2MB untuk menjaga performa memori.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;

                setBahan({ ...bahan, gambar: base64String });

                const savedInventory = JSON.parse(localStorage.getItem('umkm_inventory')) || dummyInventory;
                const updatedInventory = savedInventory.map(item => {
                    if (item.id.toString() === id.toString()) {
                        return { ...item, gambar: base64String };
                    }
                    return item;
                });
                localStorage.setItem('umkm_inventory', JSON.stringify(updatedInventory));

                setIsSuccess(true);
                setTimeout(() => setIsSuccess(false), 2500);
            };

            reader.readAsDataURL(file);
        }
    };

    if (!bahan) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500 font-sans">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#A7D189] mb-4"></div>
                <p>Mencari detail bahan...</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-sm text-[#A7D189] hover:text-white transition-colors">Kembali ke Daftar</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto pb-6 px-4 pt-6 font-sans text-white">

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-3 bg-[#1C1C24] border border-white/10 rounded-2xl shadow-lg hover:bg-white/10 transition-colors active:scale-95">
                    <ArrowLeft size={20} className="text-gray-300" />
                </button>
                <h2 className="text-2xl font-black text-white tracking-tight">Detail Bahan</h2>
            </div>

            {/* Kartu Gambar & Status */}
            <div className="bg-[#1C1C24] rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/5 mb-6 flex flex-col relative overflow-hidden">

                {/* AREA GAMBAR (INTERAKTIF) */}
                <div className="h-72 w-full bg-[#252530] relative group cursor-pointer overflow-hidden">
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                        title="Klik untuk ganti foto"
                    />

                    <img
                        src={bahan.gambar}
                        alt={bahan.nama}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            e.target.src = `https://placehold.co/400x300/1C1C24/A7D189?text=${encodeURIComponent(bahan.nama)}`;
                        }}
                    />

                    {/* Gradient Overlay for seamless blending with bottom card */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C24] via-transparent to-transparent opacity-80 pointer-events-none"></div>

                    {/* Overlay Ganti Foto */}
                    <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none backdrop-blur-sm">
                        <div className="bg-white/10 p-4 rounded-full backdrop-blur-md mb-3 border border-white/20">
                            <Camera size={32} className="text-white" />
                        </div>
                        <span className="text-white font-black text-sm tracking-widest uppercase drop-shadow-lg">Ketuk Ganti Foto</span>
                    </div>

                    <div className="absolute top-5 right-5 z-30 shadow-xl pointer-events-none">
                        <Badge variant={bahan.status === 'Kritis' ? 'danger' : (bahan.status === 'Kurang' ? 'warning' : 'success')}>
                            {bahan.status}
                        </Badge>
                    </div>
                </div>

                <div className="p-6 relative z-10 bg-[#1C1C24]">
                    <h3 className="text-3xl font-black text-white mb-6 tracking-tight">{bahan.nama}</h3>

                    <div className="space-y-4">
                        {/* Box Kuantitas */}
                        <div className="flex items-center gap-4 bg-[#252530] p-4 rounded-2xl border border-white/5 shadow-inner">
                            <div className="w-14 h-14 bg-[#1C1C24] border border-white/5 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                                <Package size={26} className="text-[#A7D189]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-1">Kuantitas Tersedia</span>
                                <span className="font-black text-2xl text-white">{bahan.sisa}</span>
                            </div>
                        </div>

                        {/* Box Kondisi/Waktu */}
                        <div className="flex items-center gap-4 bg-[#252530] p-4 rounded-2xl border border-white/5 shadow-inner">
                            <div className="w-14 h-14 bg-[#1C1C24] border border-white/5 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                                <Calendar size={26} className="text-blue-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-1">Kondisi / Waktu</span>
                                <span className="font-bold text-white text-lg">{bahan.sisaWaktu}</span>
                                <span className="text-[10px] font-medium text-gray-500 mt-1">Sistem Update: {formatDate(new Date())}</span>
                            </div>
                        </div>

                        {/* Alert Kritis */}
                        {bahan.status === 'Kritis' && (
                            <div className="mt-6 bg-red-500/10 p-5 rounded-2xl border border-red-500/20 flex items-start gap-4 animate-fade-in shadow-[0_10px_20px_rgba(239,68,68,0.1)]">
                                <AlertCircle size={26} className="text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-400 font-medium leading-relaxed">
                                    Bahan ini memerlukan tindakan cepat. Segera buat <strong className="text-red-300">Promo Diskon</strong> atau alokasikan untuk <strong className="text-red-300">Donasi</strong>.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ToastNotification isVisible={isSuccess} message="Foto bahan berhasil diperbarui!" />
        </div>
    );
};

export default DetailBahan;