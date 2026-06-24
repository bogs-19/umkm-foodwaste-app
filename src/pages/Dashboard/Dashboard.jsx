import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, TrendingUp, PackageCheck, Tag, Plus, Trash2, X, CheckCircle2, HeartHandshake, ChevronRight } from 'lucide-react';
import { dummyInventory } from '../../data/dummyInventory';
import { StatistikCard } from '../../components/Cards/StatistikCard';

const Dashboard = () => {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [bahanKritis, setBahanKritis] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newBahan, setNewBahan] = useState({ nama: '', sisa: '', satuan: 'kg', sisaWaktu: '7 Hari', status: 'Aman' });

    useEffect(() => {
        const loadInventory = () => {
            const saved = localStorage.getItem('umkm_inventory');
            if (saved) {
                return JSON.parse(saved);
            } else {
                localStorage.setItem('umkm_inventory', JSON.stringify(dummyInventory));
                return dummyInventory;
            }
        };

        const currentInventory = loadInventory();
        setInventory(currentInventory);

        // Kita anggap bahan Kritis dan Warning (Kurang) sebagai bahan yang berpotensi masuk Flash Sale
        setBahanKritis(currentInventory.filter(item => item.status === 'Kritis' || item.status === 'Kurang'));
    }, []);

    const handleDelete = (idYangDihapus) => {
        const konfirmasi = window.confirm("Hapus bahan ini dari seluruh sistem inventaris?");
        if (konfirmasi) {
            const updatedInventory = inventory.filter(item => item.id !== idYangDihapus);
            setInventory(updatedInventory);
            setBahanKritis(updatedInventory.filter(item => item.status === 'Kritis' || item.status === 'Kurang'));
            localStorage.setItem('umkm_inventory', JSON.stringify(updatedInventory));
        }
    };

    const handleAddBahan = (e) => {
        e.preventDefault();
        const dataBaru = {
            id: Date.now(),
            nama: newBahan.nama,
            sisa: `${newBahan.sisa} ${newBahan.satuan}`,
            sisaWaktu: newBahan.sisaWaktu,
            status: newBahan.status,
            gambar: `https://placehold.co/400x300/e2e8f0/475569?text=${encodeURIComponent(newBahan.nama)}`
        };

        const updatedInventory = [dataBaru, ...inventory];
        setInventory(updatedInventory);
        setBahanKritis(updatedInventory.filter(item => item.status === 'Kritis' || item.status === 'Kurang'));
        localStorage.setItem('umkm_inventory', JSON.stringify(updatedInventory));

        setIsAddModalOpen(false);
        setNewBahan({ nama: '', sisa: '', satuan: 'kg', sisaWaktu: '7 Hari', status: 'Aman' });
    };

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto space-y-6 pb-24 relative">

            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Halo, Bagus!</h2>
                    <p className="text-gray-500 mt-1">Berikut adalah ringkasan inventaris dapurmu hari ini.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="p-3 bg-[#1A361D] text-white rounded-xl shadow-md hover:bg-[#122614] transition-colors flex items-center justify-center font-bold text-sm"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* KONDISI 1: ADA BAHAN KRITIS -> TAMPILKAN KOTAK MERAH FEFO + TOMBOL PROMO DI DALAMNYA */}
            {bahanKritis.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl shadow-sm animate-fade-in relative overflow-hidden">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="ml-4 flex-1">
                            <h3 className="text-lg font-bold text-red-800">
                                AWAS! {bahanKritis.length} Bahan Segera Basi
                            </h3>
                            <div className="mt-2 text-sm text-red-700 space-y-2">
                                {bahanKritis.slice(0, 2).map((item) => (
                                    <div key={item.id} className="flex justify-between items-center bg-white/50 p-2 rounded-lg">
                                        <span className="font-semibold">{item.nama} ({item.sisa})</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-red-600 px-2 py-1 bg-white rounded-md text-xs">
                                                Sisa: {item.sisaWaktu}
                                            </span>
                                            <button onClick={() => handleDelete(item.id)} className="p-1 text-red-400 hover:text-red-700 hover:bg-red-100 rounded transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {bahanKritis.length > 2 && (
                                    <p className="text-xs italic mt-2">+ {bahanKritis.length - 2} bahan lainnya...</p>
                                )}
                            </div>

                            <div className="mt-4">
                                <button
                                    onClick={() => navigate('/promo')} // Kita arahkan ke halaman List Promo baru
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <Tag size={16} />
                                    Buat Promo Flash Sale Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-2">
                <StatistikCard
                    icon={<PackageCheck size={32} />}
                    title="Total Stok Aman"
                    value={`${inventory.filter(i => i.status === 'Aman').length} Item`}
                    colorClass="text-green-500"
                />
                <StatistikCard
                    icon={<TrendingUp size={32} />}
                    title="Food Waste Dicegah"
                    value="60%"
                    colorClass="text-blue-500"
                />
            </div>

            {/* KONDISI 2: JIKA TIDAK ADA BAHAN KRITIS (Kotak Merah Hilang), TAMPILKAN MENU AKSI CEPAT DI SINI */}
            {bahanKritis.length === 0 ? (
                <div className="mt-2 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Aksi Cepat</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => navigate('/promo')}
                            className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:border-red-200 hover:bg-red-50 transition-all flex flex-col items-center justify-center gap-2 group"
                        >
                            <div className="p-3 bg-red-100 text-red-500 rounded-full group-hover:scale-110 transition-transform">
                                <Tag size={24} />
                            </div>
                            <span className="font-bold text-gray-700 text-sm text-center">Buat Flash Sale</span>
                        </button>

                        <button
                            onClick={() => navigate('/donasi')}
                            className="bg-green-50/50 border border-green-100 p-4 rounded-2xl shadow-sm hover:border-green-300 hover:bg-green-100 transition-all flex flex-col items-center justify-center gap-2 group"
                        >
                            <div className="p-3 bg-green-100 text-green-600 rounded-full group-hover:scale-110 transition-transform">
                                <HeartHandshake size={24} />
                            </div>
                            <span className="font-bold text-gray-800 text-sm text-center">Katalog Donasi</span>
                        </button>
                    </div>
                </div>
            ) : (
                /* JIKA KOTAK MERAH MUNCUL, KATALOG DONASI JADI BANNER MEMANJANG DI BAWAH */
                <div className="mt-2 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Tindakan Lanjutan</h3>
                    <button
                        onClick={() => navigate('/donasi')}
                        className="w-full bg-green-50/50 border border-green-100 p-4 rounded-2xl shadow-sm hover:border-[#A7D189] hover:bg-green-50 transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
                                <HeartHandshake size={24} />
                            </div>
                            <div className="text-left">
                                <span className="font-bold text-gray-800 block text-base">Katalog Donasi</span>
                                <span className="text-xs text-gray-500">Salurkan bahan berlebih ke mitra</span>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-green-600 transition-colors" />
                    </button>
                </div>
            )}

            {/* MODAL TAMBAH BAHAN TETAP SAMA SEPERTI SEBELUMNYA */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-slide-down my-8">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800">Tambah Inventaris Baru</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddBahan} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">NAMA BAHAN</label>
                                <input type="text" required value={newBahan.nama} onChange={(e) => setNewBahan({ ...newBahan, nama: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#A7D189]" />
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">SISA STOK</label>
                                    <input type="number" required step="0.1" value={newBahan.sisa} onChange={(e) => setNewBahan({ ...newBahan, sisa: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#A7D189]" />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">SATUAN</label>
                                    <select value={newBahan.satuan} onChange={(e) => setNewBahan({ ...newBahan, satuan: e.target.value })} className="w-full px-2 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#A7D189]">
                                        <option value="kg">kg</option>
                                        <option value="gram">gram</option>
                                        <option value="Ikat">Ikat</option>
                                        <option value="Pcs">Pcs</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">STATUS STOK</label>
                                <select value={newBahan.status} onChange={(e) => setNewBahan({ ...newBahan, status: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#A7D189]">
                                    <option value="Aman">🟢 Aman</option>
                                    <option value="Kurang">🟡 Kurang (Perlu Restock)</option>
                                    <option value="Kritis">🔴 Kritis (Hampir Habis)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">KONDISI BARANG</label>
                                <select value={newBahan.sisaWaktu} onChange={(e) => setNewBahan({ ...newBahan, sisaWaktu: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#A7D189]">
                                    <option value="Aman / Tidak Basi">Awet / Tidak Mudah Basi</option>
                                    <option value="7 Hari">Sisa 7 Hari Lagi</option>
                                    <option value="3 Hari">Sisa 3 Hari Lagi</option>
                                    <option value="1 Hari">Sisa 1 Hari (Mau Basi!)</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full mt-4 py-3 bg-[#1A361D] text-white rounded-xl font-bold flex justify-center gap-2 hover:bg-[#122614]">
                                <CheckCircle2 size={18} /> Simpan ke Gudang
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;