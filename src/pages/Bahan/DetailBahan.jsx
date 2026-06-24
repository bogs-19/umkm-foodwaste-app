import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, AlertCircle, Camera } from 'lucide-react';
import { dummyInventory } from '../../data/dummyInventory';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/dateFormatter';
import { ToastNotification } from '../../components/Modals/ToastNotification'; // Pastikan path ini benar sesuai struktur Anda

const DetailBahan = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [bahan, setBahan] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false); // Untuk Toast Notification

    useEffect(() => {
        const savedInventory = localStorage.getItem('umkm_inventory');
        const inventoryData = savedInventory ? JSON.parse(savedInventory) : dummyInventory;
        const foundItem = inventoryData.find(item => item.id.toString() === id.toString());
        setBahan(foundItem);
    }, [id]);

    // =========================================================
    // FUNGSI UBAH GAMBAR (Konversi ke Base64 & Auto-Save)
    // =========================================================
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi ukuran gambar maksimal 2MB
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran gambar terlalu besar! Maksimal 2MB untuk menjaga performa memori.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;

                // 1. Update State Lokal agar UI langsung berubah
                setBahan({ ...bahan, gambar: base64String });

                // 2. Simpan permanen ke localStorage
                const savedInventory = JSON.parse(localStorage.getItem('umkm_inventory')) || dummyInventory;
                const updatedInventory = savedInventory.map(item => {
                    if (item.id.toString() === id.toString()) {
                        return { ...item, gambar: base64String };
                    }
                    return item;
                });
                localStorage.setItem('umkm_inventory', JSON.stringify(updatedInventory));

                // 3. Tampilkan Notifikasi Sukses
                setIsSuccess(true);
                setTimeout(() => setIsSuccess(false), 2500);
            };

            // Eksekusi pembacaan file
            reader.readAsDataURL(file);
        }
    };

    if (!bahan) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A361D] mb-4"></div>
                <p>Mencari detail bahan...</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-sm text-blue-500 underline">Kembali</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto pb-6 px-4 pt-6">

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Detail Bahan</h2>
            </div>

            {/* Kartu Gambar & Status */}
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 mb-6 flex flex-col relative overflow-visible">

                {/* AREA GAMBAR (INTERAKTIF) 
                    Dibuat relative dengan group agar bisa menampilkan overlay saat di-hover/ditekan
                */}
                <div className="h-64 w-full bg-gray-100 relative group cursor-pointer overflow-hidden rounded-t-3xl">

                    {/* Input file disembunyikan tapi ukurannya memenuhi seluruh area gambar */}
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                        title="Klik untuk ganti foto"
                    />

                    {/* Gambar Bahan */}
                    <img
                        src={bahan.gambar}
                        alt={bahan.nama}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            // Fallback jika string gambar rusak/tidak valid
                            e.target.src = `https://placehold.co/400x300/e2e8f0/475569?text=${encodeURIComponent(bahan.nama)}`;
                        }}
                    />

                    {/* Overlay Ganti Foto (Hanya Muncul saat Hover/Disentuh) */}
                    <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-md mb-2">
                            <Camera size={28} className="text-white" />
                        </div>
                        <span className="text-white font-bold text-sm tracking-wide drop-shadow-md">Ketuk untuk Ganti Foto</span>
                    </div>

                    {/* Badge Status (Z-index dinaikkan agar tidak tertutup overlay file input) */}
                    <div className="absolute top-4 right-4 z-30 shadow-sm pointer-events-none">
                        <Badge variant={bahan.status === 'Kritis' ? 'danger' : (bahan.status === 'Kurang' ? 'warning' : 'success')}>
                            {bahan.status}
                        </Badge>
                    </div>
                </div>

                <div className="p-6 rounded-b-3xl bg-white z-10">
                    <h3 className="text-3xl font-black text-gray-800 mb-5">{bahan.nama}</h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                <Package size={24} className="text-[#A7D189]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Kuantitas Tersedia</span>
                                <span className="font-black text-xl text-gray-800">{bahan.sisa}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                <Calendar size={24} className="text-blue-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Kondisi / Batas Waktu</span>
                                <span className="font-bold text-gray-800">{bahan.sisaWaktu}</span>
                                <span className="text-[11px] font-medium text-gray-500 mt-0.5">Sistem Dapur: {formatDate(new Date())}</span>
                            </div>
                        </div>

                        {/* Alert khusus untuk bahan Kritis */}
                        {bahan.status === 'Kritis' && (
                            <div className="mt-4 bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3 animate-fade-in shadow-sm">
                                <AlertCircle size={24} className="text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800 font-medium leading-relaxed">
                                    Bahan ini memerlukan tindakan cepat. Segera buat promo Flash Sale atau alokasikan untuk donasi.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* NOTIFIKASI TOAST BERHASIL */}
            <ToastNotification isVisible={isSuccess} message="Foto bahan berhasil diperbarui!" />
        </div>
    );
};

export default DetailBahan;