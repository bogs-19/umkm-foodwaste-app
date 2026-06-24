import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, CheckCircle2, AlertTriangle, Plus, X, PackagePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dummyInventory } from '../../data/dummyInventory';
import { ToastNotification } from '../../components/Modals/ToastNotification';

const BarangRestock = () => {
    const navigate = useNavigate();
    const [restockList, setRestockList] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({ tambahanStok: '', status: 'Aman', sisaWaktu: 'Aman / Tidak Basi' });

    useEffect(() => {
        const savedInventory = JSON.parse(localStorage.getItem('umkm_inventory')) || dummyInventory;
        const butuhRestock = savedInventory.filter(item => item.status === 'Kurang' || item.status === 'Kritis');
        setRestockList(butuhRestock);
    }, []);

    const openRestockModal = (item) => {
        setSelectedItem(item);
        setFormData({ tambahanStok: '', status: 'Aman', sisaWaktu: 'Aman / Tidak Basi' });
        setIsModalOpen(true);
    };

    const handleSimpanRestock = (e) => {
        e.preventDefault();
        if (!formData.tambahanStok || parseFloat(formData.tambahanStok) <= 0) return alert("Harap masukkan jumlah yang valid!");

        const currentStockNum = parseFloat(selectedItem.sisa) || 0;
        const satuan = selectedItem.sisa.replace(/[0-9.]/g, '').trim() || 'kg';
        const totalStock = currentStockNum + parseFloat(formData.tambahanStok);
        const newSisaString = `${totalStock} ${satuan}`;

        const savedInventory = JSON.parse(localStorage.getItem('umkm_inventory')) || dummyInventory;
        const updatedInventory = savedInventory.map(item => item.id === selectedItem.id ? { ...item, sisa: newSisaString, status: formData.status, sisaWaktu: formData.sisaWaktu } : item);

        localStorage.setItem('umkm_inventory', JSON.stringify(updatedInventory));
        setRestockList(updatedInventory.filter(item => item.status === 'Kurang' || item.status === 'Kritis'));
        setIsModalOpen(false); setIsSuccess(true); setTimeout(() => setIsSuccess(false), 2500);
    };

    return (
        <div className="flex flex-col min-h-full w-full max-w-md mx-auto relative overflow-x-hidden pb-24 px-4 pt-6 text-white font-sans">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/dashboard')} className="p-2 bg-[#1C1C24] border border-white/5 rounded-full hover:bg-white/10 transition-colors"><ArrowLeft size={20} className="text-gray-300" /></button>
                <h2 className="text-2xl font-black tracking-wide text-white">Daftar Belanja</h2>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-[24px] p-5 flex gap-4 items-start mb-8 shadow-lg">
                <ShoppingCart size={24} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-100/80 font-medium leading-relaxed">Ini adalah daftar barang yang harus segera direstock di pasar. Masukkan jumlah yang baru dibeli untuk memperbarui stok.</p>
            </div>

            {restockList.length === 0 ? (
                <div className="text-center py-12 bg-[#A7D189]/10 border border-dashed border-[#A7D189]/30 rounded-[32px] animate-fade-in shadow-lg">
                    <CheckCircle2 size={48} className="mx-auto mb-4 text-[#A7D189]" />
                    <h3 className="font-black text-white text-xl mb-1">Gudang Aman!</h3>
                    <p className="text-sm text-[#A7D189] font-medium">Tidak ada barang yang perlu dibeli saat ini.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="font-black text-white text-sm mb-4 flex items-center gap-2 uppercase tracking-widest text-orange-400"><AlertTriangle size={18} /> Harus Dibeli ({restockList.length})</h3>
                    {restockList.map((item) => (
                        <div key={item.id} className="bg-[#1C1C24] rounded-[24px] p-4 flex items-center justify-between shadow-lg border border-orange-500/20 group hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-[18px] overflow-hidden bg-[#252530] shrink-0 border border-white/5"><img src={item.gambar} alt={item.nama} className="w-full h-full object-cover" /></div>
                                <div><h3 className="font-bold text-white text-base">{item.nama}</h3><p className="text-xs text-gray-400 mt-1 font-medium">Sisa di Gudang: <span className="font-bold text-orange-400">{item.sisa}</span></p></div>
                            </div>
                            <button onClick={() => openRestockModal(item)} className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-[16px] hover:bg-blue-500 hover:text-white transition-all shadow-sm flex flex-col items-center justify-center gap-1 min-w-[70px] active:scale-95"><Plus size={20} className="stroke-[3px]" /><span className="text-[9px] font-black uppercase tracking-wider">Input</span></button>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1528]/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#1C1C24] w-full max-w-sm rounded-[36px] shadow-2xl overflow-hidden border border-white/10 animate-slide-down">
                        <div className="flex items-center justify-between p-6 border-b border-white/5"><h3 className="font-black text-white flex items-center gap-2 text-lg"><PackagePlus size={22} className="text-blue-400" /> Update Stok Baru</h3><button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors"><X size={24} /></button></div>
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6 bg-[#252530] p-4 rounded-[20px] border border-white/5">
                                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0"><img src={selectedItem.gambar} alt={selectedItem.nama} className="w-full h-full object-cover" /></div>
                                <div><p className="text-base font-bold text-white">{selectedItem.nama}</p><p className="text-xs text-gray-400 mt-1">Sisa saat ini: <span className="font-bold text-orange-400">{selectedItem.sisa}</span></p></div>
                            </div>
                            <form onSubmit={handleSimpanRestock} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Tambahan Stok (Yang Dibeli)</label>
                                    <div className="relative">
                                        <input type="number" step="0.1" required autoFocus value={formData.tambahanStok} onChange={(e) => setFormData({ ...formData, tambahanStok: e.target.value })} placeholder="Contoh: 5.5" className="w-full px-5 py-4 bg-[#13131A] border border-white/5 rounded-2xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pr-16 text-white placeholder-gray-600 font-bold text-lg" />
                                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none"><span className="text-blue-400 text-sm font-black uppercase">{selectedItem.sisa.replace(/[0-9.]/g, '').trim() || 'kg'}</span></div>
                                    </div>
                                </div>
                                <div><label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Status Stok Sekarang</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-5 py-4 bg-[#13131A] border border-white/5 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all text-white appearance-none"><option value="Aman">🟢 Aman (Stok sudah cukup)</option><option value="Kurang">🟡 Masih Kurang (Belum cukup)</option></select></div>
                                <div><label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Kondisi Barang Baru</label><select value={formData.sisaWaktu} onChange={(e) => setFormData({ ...formData, sisaWaktu: e.target.value })} className="w-full px-5 py-4 bg-[#13131A] border border-white/5 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all text-white appearance-none"><option value="Aman / Tidak Basi">Awet / Tidak Mudah Basi</option><option value="7 Hari">Sisa 7 Hari Lagi</option><option value="3 Hari">Sisa 3 Hari Lagi</option></select></div>
                                <button type="submit" className="w-full mt-4 py-4.5 bg-blue-600 text-white rounded-[20px] font-black flex justify-center items-center gap-2 hover:bg-blue-500 shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all active:scale-95 text-base">Simpan Data Stok</button>
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