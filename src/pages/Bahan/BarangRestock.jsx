import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, CheckCircle2, AlertTriangle, Plus, X, PackagePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dummyInventory } from '../../data/dummyInventory';
import { ToastNotification } from '../../components/Modals/ToastNotification';

const BarangRestock = () => {
    const navigate = useNavigate();
    const [restockList, setRestockList] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);

    // ==========================================
    // STATE UNTUK CUSTOM MODAL RESTOCK
    // ==========================================
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        tambahanStok: '',
        status: 'Aman',
        sisaWaktu: 'Aman / Tidak Basi'
    });

    useEffect(() => {
        const savedInventory = JSON.parse(localStorage.getItem('umkm_inventory')) || dummyInventory;
        // Hanya ambil barang yang statusnya Kurang atau Kritis
        const butuhRestock = savedInventory.filter(item => item.status === 'Kurang' || item.status === 'Kritis');
        setRestockList(butuhRestock);
    }, []);

    // FUNGSI MEMBUKA MODAL DAN MENYIAPKAN DATA
    const openRestockModal = (item) => {
        setSelectedItem(item);
        setFormData({
            tambahanStok: '', // Kosongkan agar user input jumlah yang dibeli
            status: 'Aman',   // Asumsi default beli cukup
            sisaWaktu: 'Aman / Tidak Basi' // Asumsi barang baru masih segar
        });
        setIsModalOpen(true);
    };

    // FUNGSI EKSEKUSI PENAMBAHAN STOK
    const handleSimpanRestock = (e) => {
        e.preventDefault();

        if (!formData.tambahanStok || parseFloat(formData.tambahanStok) <= 0) {
            alert("Harap masukkan jumlah tambahan stok yang valid!");
            return;
        }

        // Pisahkan angka dan satuan dari stok lama (Misal: "2 kg" -> angka 2, satuan "kg")
        const currentStockNum = parseFloat(selectedItem.sisa) || 0;
        const satuan = selectedItem.sisa.replace(/[0-9.]/g, '').trim() || 'kg';

        // Hitung total stok baru
        const addedStockNum = parseFloat(formData.tambahanStok);
        const totalStock = currentStockNum + addedStockNum;
        const newSisaString = `${totalStock} ${satuan}`;

        const savedInventory = JSON.parse(localStorage.getItem('umkm_inventory')) || dummyInventory;

        const updatedInventory = savedInventory.map(item => {
            if (item.id === selectedItem.id) {
                return {
                    ...item,
                    sisa: newSisaString,
                    status: formData.status,
                    sisaWaktu: formData.sisaWaktu
                };
            }
            return item;
        });

        // Simpan ke Local Storage
        localStorage.setItem('umkm_inventory', JSON.stringify(updatedInventory));

        // Update tampilan List (Hanya tampilkan yang masih Kritis/Kurang)
        setRestockList(updatedInventory.filter(item => item.status === 'Kurang' || item.status === 'Kritis'));

        // Tutup modal dan tampilkan notifikasi sukses
        setIsModalOpen(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2500);
    };

    return (
        <div className="flex flex-col min-h-full w-full max-w-md mx-auto relative overflow-x-hidden pb-24 px-4 pt-6">

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Daftar Belanja</h2>
            </div>

            {/* Banner Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start mb-6">
                <ShoppingCart size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 font-medium leading-relaxed">
                    Ini adalah daftar barang yang harus segera direstock (dibeli di pasar). Masukkan jumlah barang yang baru dibeli untuk memperbarui stok.
                </p>
            </div>

            {/* LIST BARANG RESTOCK */}
            {restockList.length === 0 ? (
                <div className="text-center py-10 bg-green-50 border border-dashed border-green-200 rounded-2xl animate-fade-in">
                    <CheckCircle2 size={40} className="mx-auto mb-3 text-green-500" />
                    <h3 className="font-bold text-green-800 mb-1">Gudang Aman!</h3>
                    <p className="text-xs text-green-600">Tidak ada barang yang perlu dibeli saat ini.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-orange-500" /> Harus Dibeli ({restockList.length})
                    </h3>
                    {restockList.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-orange-200 group">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                                    <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-base">{item.nama}</h3>
                                    <p className="text-xs text-gray-500 mt-1">Sisa di Gudang: <span className="font-bold text-red-500">{item.sisa}</span></p>
                                </div>
                            </div>

                            {/* Tombol Buka Modal Input Restock */}
                            <button
                                onClick={() => openRestockModal(item)}
                                className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm flex flex-col items-center justify-center gap-1 min-w-[70px]"
                            >
                                <Plus size={18} />
                                <span className="text-[9px] font-bold uppercase">Input</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* ========================================================= */}
            {/* CUSTOM MODAL: FORM INPUT STOK BARU */}
            {/* ========================================================= */}
            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-slide-down">

                        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <PackagePlus size={18} className="text-blue-500" /> Update Stok Baru
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-5">
                            {/* Info Barang yang sedang direstock */}
                            <div className="flex items-center gap-3 mb-5 bg-blue-50 p-3 rounded-xl border border-blue-100">
                                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                    <img src={selectedItem.gambar} alt={selectedItem.nama} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-blue-900">{selectedItem.nama}</p>
                                    <p className="text-xs text-blue-700">Sisa saat ini: <span className="font-bold">{selectedItem.sisa}</span></p>
                                </div>
                            </div>

                            <form onSubmit={handleSimpanRestock} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">TAMBAHAN STOK (YANG DIBELI)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            autoFocus
                                            value={formData.tambahanStok}
                                            onChange={(e) => setFormData({ ...formData, tambahanStok: e.target.value })}
                                            placeholder="Contoh: 5"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-16"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <span className="text-gray-400 text-sm font-semibold">
                                                {selectedItem.sisa.replace(/[0-9.]/g, '').trim() || 'kg'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">STATUS STOK SEKARANG</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    >
                                        <option value="Aman">🟢 Aman (Stok sudah cukup)</option>
                                        <option value="Kurang">🟡 Masih Kurang (Belum beli cukup)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">KONDISI BARANG BARU</label>
                                    <select
                                        value={formData.sisaWaktu}
                                        onChange={(e) => setFormData({ ...formData, sisaWaktu: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    >
                                        <option value="Aman / Tidak Basi">Awet / Tidak Mudah Basi</option>
                                        <option value="7 Hari">Sisa 7 Hari Lagi</option>
                                        <option value="3 Hari">Sisa 3 Hari Lagi</option>
                                    </select>
                                </div>

                                <button type="submit" className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 shadow-md transition-colors active:scale-95">
                                    <CheckCircle2 size={18} /> Simpan Data Stok Baru
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <ToastNotification isVisible={isSuccess} message="Stok barang berhasil diperbarui!" />
        </div>
    );
};

export default BarangRestock;