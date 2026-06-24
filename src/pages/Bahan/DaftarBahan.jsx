import React, { useState, useEffect } from 'react';
import { Search, Plus, ArrowLeft, Trash2, X, CheckCircle2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dummyInventory } from '../../data/dummyInventory';
import { BahanCard } from '../../components/Cards/BahanCard';

const DaftarBahan = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [inventory, setInventory] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // STATE BARU: Ditambahkan 'gambarPreview' untuk menampung Base64 dari foto yang diupload
    const [newBahan, setNewBahan] = useState({
        nama: '',
        sisa: '',
        satuan: 'kg',
        sisaWaktu: 'Aman / Tidak Basi',
        status: 'Aman',
        gambarPreview: ''
    });

    useEffect(() => {
        const saved = localStorage.getItem('umkm_inventory');
        if (saved) {
            setInventory(JSON.parse(saved));
        } else {
            setInventory(dummyInventory);
        }
    }, []);

    const handleDelete = (idYangDihapus, namaBahan) => {
        const konfirmasi = window.confirm(`Buang "${namaBahan}" dari inventaris secara permanen?`);
        if (konfirmasi) {
            const updatedInventory = inventory.filter(item => item.id !== idYangDihapus);
            setInventory(updatedInventory);
            localStorage.setItem('umkm_inventory', JSON.stringify(updatedInventory));
        }
    };

    // FUNGSI BARU: Menangani Upload Foto & Konversi ke Base64
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi ukuran sederhana (Maks 2MB agar localstorage tidak cepat penuh)
            if (file.size > 2 * 1024 * 1024) {
                alert("Ukuran gambar terlalu besar. Maksimal 2MB ya!");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                // reader.result berisi string Base64 dari gambar
                setNewBahan({ ...newBahan, gambarPreview: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddBahan = (e) => {
        e.preventDefault();
        const dataBaru = {
            id: Date.now(), // ID Unik
            nama: newBahan.nama,
            sisa: `${newBahan.sisa} ${newBahan.satuan}`,
            sisaWaktu: newBahan.sisaWaktu,
            status: newBahan.status,
            // LOGIKA GAMBAR: Pakai gambar upload user. Jika tidak ada, panggil placeholder.
            gambar: newBahan.gambarPreview || `https://placehold.co/400x300/e2e8f0/475569?text=${encodeURIComponent(newBahan.nama)}`
        };

        const updatedInventory = [dataBaru, ...inventory];
        setInventory(updatedInventory);
        localStorage.setItem('umkm_inventory', JSON.stringify(updatedInventory));

        setIsAddModalOpen(false);
        // Reset form termasuk gambar
        setNewBahan({ nama: '', sisa: '', satuan: 'kg', sisaWaktu: 'Aman / Tidak Basi', status: 'Aman', gambarPreview: '' });
    };

    const filteredBahan = inventory.filter(item =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto pb-24 relative px-4">

            <div className="flex items-center justify-between mb-6 mt-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                        <ArrowLeft size={20} className="text-gray-700" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Semua Inventaris</h2>
                </div>
            </div>

            <div className="flex gap-3 mb-8">
                <div className="relative flex-1">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Cari bahan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A7D189]" />
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="px-5 bg-[#A7D189] text-[#1A361D] rounded-xl hover:bg-[#95C276] font-bold flex items-center justify-center shadow-sm transition-transform active:scale-95">
                    <Plus size={24} />
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredBahan.map((item) => (
                    <div key={item.id} className="relative group cursor-pointer">
                        <div onClick={(e) => { e.stopPropagation(); navigate(`/bahan/${item.id}`); }}>
                            <BahanCard item={item} />
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.nama); }} className="absolute bottom-3 right-3 p-2 bg-red-50 text-red-500 rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all shadow-sm hover:bg-red-100 hover:scale-110" title={`Hapus ${item.nama}`}>
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {filteredBahan.length === 0 && (
                <div className="text-center py-12 text-gray-400 animate-fade-in">
                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-medium text-gray-500">Bahan tidak ditemukan.</p>
                </div>
            )}

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-slide-down my-8">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800">Tambah Inventaris Baru</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 bg-white p-1 rounded-full shadow-sm"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleAddBahan} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

                            {/* AREA UPLOAD FOTO (UI/UX MODERN) */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">FOTO BARANG (OPSIONAL)</label>
                                <div className="relative border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 p-4 text-center cursor-pointer hover:bg-green-50 hover:border-[#A7D189] transition-all group overflow-hidden h-36 flex flex-col justify-center items-center">
                                    {/* Input file disembunyikan tapi menutupi seluruh area */}
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />

                                    {newBahan.gambarPreview ? (
                                        <>
                                            <img src={newBahan.gambarPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-40 transition-opacity" />
                                            <div className="relative z-0 bg-black/50 text-white px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                <ImageIcon size={14} /> Ganti Foto
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud size={32} className="text-gray-400 mb-2 group-hover:text-[#A7D189] transition-colors" />
                                            <span className="text-sm font-medium text-gray-600 group-hover:text-[#1A361D]">Ketuk untuk Upload Foto</span>
                                            <span className="text-[10px] text-gray-400 mt-1">Format: JPG, PNG (Maks 2MB)</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">NAMA BAHAN</label>
                                <input type="text" required value={newBahan.nama} onChange={(e) => setNewBahan({ ...newBahan, nama: e.target.value })} placeholder="Contoh: Gula Pasir" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#A7D189] transition-all" />
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">JUMLAH STOK</label>
                                    <input type="number" required step="0.1" value={newBahan.sisa} onChange={(e) => setNewBahan({ ...newBahan, sisa: e.target.value })} placeholder="Misal: 5" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#A7D189] transition-all" />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">SATUAN</label>
                                    <select value={newBahan.satuan} onChange={(e) => setNewBahan({ ...newBahan, satuan: e.target.value })} className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#A7D189] transition-all">
                                        <option value="kg">kg</option>
                                        <option value="gram">gram</option>
                                        <option value="Liter">Liter</option>
                                        <option value="Pcs">Pcs</option>
                                        <option value="Ikat">Ikat</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">STATUS STOK</label>
                                <select value={newBahan.status} onChange={(e) => setNewBahan({ ...newBahan, status: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#A7D189] transition-all">
                                    <option value="Aman">🟢 Aman</option>
                                    <option value="Kurang">🟡 Kurang (Perlu Restock)</option>
                                    <option value="Kritis">🔴 Kritis (Hampir Habis)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">KONDISI BARANG</label>
                                <select value={newBahan.sisaWaktu} onChange={(e) => setNewBahan({ ...newBahan, sisaWaktu: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#A7D189] transition-all">
                                    <option value="Aman / Tidak Basi">Awet / Tidak Mudah Basi</option>
                                    <option value="7 Hari">Sisa 7 Hari Lagi</option>
                                    <option value="3 Hari">Sisa 3 Hari Lagi</option>
                                    <option value="1 Hari">Sisa 1 Hari (Mau Basi!)</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full mt-6 py-4 bg-[#1A361D] text-white rounded-xl font-bold flex justify-center gap-2 hover:bg-[#122614] shadow-md transition-all active:scale-95">
                                <CheckCircle2 size={20} /> Simpan ke Gudang
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DaftarBahan;