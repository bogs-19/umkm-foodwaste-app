import React, { useState, useEffect } from 'react';
import { Search, Plus, ArrowLeft, Trash2, X, CheckCircle2, UploadCloud, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dummyInventory } from '../../data/dummyInventory';
import { BahanCard } from '../../components/Cards/BahanCard';
import { ToastNotification } from '../../components/Modals/ToastNotification';

const DaftarBahan = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [inventory, setInventory] = useState([]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, idBahan: null, namaBahan: '' });

    // STATE KUNCI BRANKAS
    const [storageKey, setStorageKey] = useState('umkm_inventory_guest');

    const [newBahan, setNewBahan] = useState({
        nama: '', sisa: '', satuan: 'kg', sisaWaktu: 'Aman / Tidak Basi', status: 'Aman', gambarPreview: ''
    });

    useEffect(() => {
        // 1. Dapatkan Kunci Brankas User
        const savedUser = localStorage.getItem('umkm_user');
        let currentKey = 'umkm_inventory_guest';

        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                if (parsedUser.id || parsedUser.email) {
                    currentKey = `umkm_inventory_${parsedUser.id || parsedUser.email}`;
                }
            } catch (e) { console.error(e); }
        }
        setStorageKey(currentKey);

        // 2. Baca isi Brankas
        const saved = localStorage.getItem(currentKey);
        if (saved) {
            setInventory(JSON.parse(saved));
        } else {
            localStorage.setItem(currentKey, JSON.stringify(dummyInventory));
            setInventory(dummyInventory);
        }
    }, []);

    const handleDeleteClick = (e, id, nama) => {
        e.stopPropagation();
        setDeleteModal({ isOpen: true, idBahan: id, namaBahan: nama });
    };

    const executeDelete = () => {
        const updatedInventory = inventory.filter(item => item.id !== deleteModal.idBahan);
        setInventory(updatedInventory);
        localStorage.setItem(storageKey, JSON.stringify(updatedInventory)); // Simpan ke brankas user
        setDeleteModal({ isOpen: false, idBahan: null, namaBahan: '' });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran gambar terlalu besar. Maksimal 2MB ya!");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setNewBahan({ ...newBahan, gambarPreview: reader.result });
            reader.readAsDataURL(file);
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
            gambar: newBahan.gambarPreview || `https://placehold.co/400x300/1C1C24/A7D189?text=${encodeURIComponent(newBahan.nama)}`
        };

        const updatedInventory = [dataBaru, ...inventory];
        setInventory(updatedInventory);

        localStorage.setItem(storageKey, JSON.stringify(updatedInventory)); // Simpan ke brankas user

        setIsAddModalOpen(false);
        setNewBahan({ nama: '', sisa: '', satuan: 'kg', sisaWaktu: 'Aman / Tidak Basi', status: 'Aman', gambarPreview: '' });

        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2500);
    };

    const filteredBahan = inventory.filter(item =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto pb-24 relative px-4 font-sans text-white">
            <div className="flex items-center justify-between mb-6 mt-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-3 bg-[#1C1C24] border border-white/10 rounded-2xl shadow-lg hover:bg-white/10 transition-colors active:scale-95">
                        <ArrowLeft size={20} className="text-gray-300" />
                    </button>
                    <h2 className="text-2xl font-black text-white tracking-tight">Semua Inventaris</h2>
                </div>
            </div>

            <div className="flex gap-3 mb-8">
                <div className="relative flex-1 group">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#A7D189] transition-colors" />
                    <input type="text" placeholder="Cari bahan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-[#1C1C24] border border-white/10 text-white rounded-2xl shadow-lg focus:outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all placeholder-gray-500" />
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="px-5 bg-[#A7D189] text-[#13131A] rounded-2xl hover:bg-[#95C276] font-black flex items-center justify-center shadow-[0_10px_20px_rgba(167,209,137,0.2)] transition-transform active:scale-95">
                    <Plus size={24} />
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredBahan.map((item) => (
                    <div key={item.id} className="relative group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                        <div onClick={(e) => { e.stopPropagation(); navigate(`/bahan/${item.id}`); }}>
                            <BahanCard item={item} />
                        </div>
                        <button
                            onClick={(e) => handleDeleteClick(e, item.id, item.nama)}
                            className="absolute bottom-3 right-3 p-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-lg active:scale-95"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {filteredBahan.length === 0 && (
                <div className="text-center py-16 text-gray-500 animate-fade-in bg-[#1C1C24] border border-white/5 rounded-[32px] mt-4">
                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-medium text-gray-400">Bahan tidak ditemukan.</p>
                </div>
            )}

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1528]/80 backdrop-blur-md animate-fade-in overflow-y-auto custom-scrollbar">
                    <div className="bg-[#1C1C24] border border-white/10 w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-slide-down my-8">
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#252530]/50">
                            <h3 className="font-black text-white text-lg">Tambah Inventaris</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-red-400 bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleAddBahan} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 tracking-wider">FOTO BARANG (OPSIONAL)</label>
                                <div className="relative border-2 border-dashed border-white/20 rounded-2xl bg-[#252530] p-4 text-center cursor-pointer hover:border-[#A7D189] hover:bg-[#A7D189]/5 transition-all group overflow-hidden h-36 flex flex-col justify-center items-center">
                                    <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    {newBahan.gambarPreview ? (
                                        <>
                                            <img src={newBahan.gambarPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-40 transition-opacity" />
                                            <div className="relative z-0 bg-black/60 text-white px-3 py-1.5 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 backdrop-blur-sm">
                                                <ImageIcon size={14} /> Ganti Foto
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud size={32} className="text-gray-500 mb-2 group-hover:text-[#A7D189] transition-colors" />
                                            <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Ketuk untuk Upload Foto</span>
                                            <span className="text-[10px] text-gray-500 mt-1">Format: JPG, PNG (Maks 2MB)</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 tracking-wider">NAMA BAHAN</label>
                                <input type="text" required value={newBahan.nama} onChange={(e) => setNewBahan({ ...newBahan, nama: e.target.value })} placeholder="Contoh: Gula Pasir" className="w-full px-4 py-4 bg-[#252530] border border-white/5 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all" />
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-400 mb-2 tracking-wider">JUMLAH STOK</label>
                                    <input type="number" required step="0.1" value={newBahan.sisa} onChange={(e) => setNewBahan({ ...newBahan, sisa: e.target.value })} placeholder="Misal: 5" className="w-full px-4 py-4 bg-[#252530] border border-white/5 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all" />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-xs font-bold text-gray-400 mb-2 tracking-wider">SATUAN</label>
                                    <select value={newBahan.satuan} onChange={(e) => setNewBahan({ ...newBahan, satuan: e.target.value })} className="w-full px-3 py-4 bg-[#252530] border border-white/5 rounded-xl text-sm text-white outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all appearance-none">
                                        <option value="kg" className="bg-[#1C1C24]">kg</option><option value="gram" className="bg-[#1C1C24]">gram</option><option value="Liter" className="bg-[#1C1C24]">Liter</option><option value="Pcs" className="bg-[#1C1C24]">Pcs</option><option value="Ikat" className="bg-[#1C1C24]">Ikat</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 tracking-wider">STATUS STOK</label>
                                <select value={newBahan.status} onChange={(e) => setNewBahan({ ...newBahan, status: e.target.value })} className="w-full px-4 py-4 bg-[#252530] border border-white/5 rounded-xl text-sm text-white outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all appearance-none">
                                    <option value="Aman" className="bg-[#1C1C24]">🟢 Aman</option><option value="Kurang" className="bg-[#1C1C24]">🟡 Kurang (Perlu Restock)</option><option value="Kritis" className="bg-[#1C1C24]">🔴 Kritis (Hampir Habis)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 tracking-wider">KONDISI BARANG</label>
                                <select value={newBahan.sisaWaktu} onChange={(e) => setNewBahan({ ...newBahan, sisaWaktu: e.target.value })} className="w-full px-4 py-4 bg-[#252530] border border-white/5 rounded-xl text-sm text-white outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all appearance-none">
                                    <option value="Aman / Tidak Basi" className="bg-[#1C1C24]">Awet / Tidak Mudah Basi</option><option value="7 Hari" className="bg-[#1C1C24]">Sisa 7 Hari Lagi</option><option value="3 Hari" className="bg-[#1C1C24]">Sisa 3 Hari Lagi</option><option value="1 Hari" className="bg-[#1C1C24]">Sisa 1 Hari (Mau Basi!)</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full mt-8 py-4 bg-[#A7D189] text-[#13131A] rounded-2xl font-black flex justify-center items-center gap-2 hover:bg-[#95C276] shadow-[0_10px_20px_rgba(167,209,137,0.2)] transition-all active:scale-95">
                                <CheckCircle2 size={20} /> Simpan ke Inventaris
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1528]/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#1C1C24] border border-white/10 w-full max-w-sm rounded-[32px] shadow-2xl p-8 text-center animate-slide-down relative">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6"><AlertTriangle size={32} /></div>
                        <h3 className="font-black text-white text-xl mb-2">Buang Bahan?</h3>
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                            Apakah Anda yakin ingin menghapus <span className="font-bold text-white">"{deleteModal.namaBahan}"</span> secara permanen?
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteModal({ isOpen: false, idBahan: null, namaBahan: '' })} className="flex-1 py-4 bg-[#252530] text-gray-300 rounded-2xl font-bold hover:bg-white/10 transition-colors">Batal</button>
                            <button onClick={executeDelete} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">Ya, Buang</button>
                        </div>
                    </div>
                </div>
            )}

            <ToastNotification isVisible={isSuccess} message="Bahan berhasil ditambahkan ke inventaris!" />
        </div>
    );
};

export default DaftarBahan;