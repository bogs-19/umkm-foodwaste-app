import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle, TrendingUp, PackageCheck, Tag, Plus, Trash2, X,
    CheckCircle2, HeartHandshake, ChevronRight, UploadCloud,
    Image as ImageIcon, BarChart3
} from 'lucide-react';
import { dummyInventory } from '../../data/dummyInventory';
import { ToastNotification } from '../../components/Modals/ToastNotification';

// IMPORT UNTUK GRAFIK
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [bahanKritis, setBahanKritis] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // STATE UNTUK IDENTITAS USER & KUNCI BRANKAS
    const [userName, setUserName] = useState('Manajer');
    const [storageKey, setStorageKey] = useState('umkm_inventory_guest');

    const [newBahan, setNewBahan] = useState({
        nama: '', sisa: '', satuan: 'kg', sisaWaktu: 'Aman / Tidak Basi', status: 'Aman', gambarPreview: ''
    });

    useEffect(() => {
        // 1. IDENTIFIKASI USER LOGIN
        const savedUser = localStorage.getItem('umkm_user');
        let currentKey = 'umkm_inventory_guest';

        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                if (parsedUser.name) setUserName(parsedUser.name.split(' ')[0]);

                // Buat kunci brankas unik berdasarkan ID atau Email User
                if (parsedUser.id || parsedUser.email) {
                    currentKey = `umkm_inventory_${parsedUser.id || parsedUser.email}`;
                }
            } catch (e) { console.error(e); }
        }
        setStorageKey(currentKey);

        // 2. LOAD DATA DARI BRANKAS KHUSUS USER TERSEBUT
        const savedInventory = localStorage.getItem(currentKey);
        let currentInventory;

        if (savedInventory) {
            currentInventory = JSON.parse(savedInventory);
        } else {
            // USER BARU: Berikan modal data dummy awal
            localStorage.setItem(currentKey, JSON.stringify(dummyInventory));
            currentInventory = dummyInventory;
        }

        setInventory(currentInventory);
        setBahanKritis(currentInventory.filter(item => item.status === 'Kritis' || item.status === 'Kurang'));
    }, []);

    // CONFIG DATA GRAFIK (Disesuaikan untuk Kartu Terang/Putih)
    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#64748B', font: { weight: '600' } } },
            y: { display: false }
        }
    };

    const chartData = {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        datasets: [
            { label: 'Diselamatkan', data: [12, 19, 15, 22, 28, 35, 40], backgroundColor: '#A7D189', borderRadius: 6 },
            { label: 'Terbuang', data: [5, 2, 4, 1, 0, 2, 1], backgroundColor: '#EF4444', borderRadius: 6 }
        ],
    };

    const handleDelete = (idYangDihapus) => {
        const konfirmasi = window.confirm("Hapus bahan ini?");
        if (konfirmasi) {
            const updated = inventory.filter(item => item.id !== idYangDihapus);
            setInventory(updated);
            setBahanKritis(updated.filter(item => item.status === 'Kritis' || item.status === 'Kurang'));
            localStorage.setItem(storageKey, JSON.stringify(updated));
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
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

        const updated = [dataBaru, ...inventory];
        setInventory(updated);
        setBahanKritis(updated.filter(item => item.status === 'Kritis' || item.status === 'Kurang'));

        localStorage.setItem(storageKey, JSON.stringify(updated));

        setIsAddModalOpen(false);
        setNewBahan({ nama: '', sisa: '', satuan: 'kg', sisaWaktu: 'Aman / Tidak Basi', status: 'Aman', gambarPreview: '' });

        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2500);
    };

    return (
        // BACKGROUND UTAMA GELAP (Seperti di Salesforce Reference)
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto space-y-6 pb-24 relative px-4 pt-8 bg-[#13131A] min-h-screen text-white font-sans selection:bg-[#A7D189] selection:text-[#13131A]">

            {/* ================= HEADER ================= */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Halo, {userName}!</h2>
                    <p className="text-gray-400 text-sm mt-1 font-medium">Berikut ringkasan dapurmu hari ini.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="w-14 h-14 bg-[#A7D189] text-[#13131A] rounded-[20px] shadow-[0_10px_25px_rgba(167,209,137,0.25)] flex items-center justify-center hover:scale-105 hover:bg-[#bbf099] hover:shadow-[0_10px_35px_rgba(167,209,137,0.4)] transition-all duration-300">
                    <Plus size={28} className="font-bold" />
                </button>
            </div>

            {/* ================= KOTAK ALERT (DARK CARD) ================= */}
            {bahanKritis.length > 0 && (
                <div className="bg-[#1C1C24] border border-red-500/20 p-6 rounded-[28px] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors duration-500"></div>
                    <div className="flex items-start gap-5 relative z-10">
                        <div className="p-4 bg-red-500/10 rounded-2xl shrink-0"><AlertTriangle className="h-6 w-6 text-red-500" /></div>
                        <div className="flex-1">
                            <h3 className="text-sm font-black text-red-400 uppercase tracking-widest mb-3">Aksi Mendesak</h3>
                            <div className="space-y-2">
                                {bahanKritis.slice(0, 2).map((item) => (
                                    <div key={item.id} className="flex justify-between items-center bg-[#252530] border border-white/5 p-3 rounded-2xl hover:border-red-500/30 transition-colors">
                                        <span className="text-sm font-semibold text-gray-200">{item.nama}</span>
                                        <div className="flex items-center gap-3">
                                            <span className={`font-bold px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider ${item.status === 'Kurang' ? 'text-orange-400 bg-orange-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                                {item.status === 'Kurang' ? 'Restock!' : `Sisa: ${item.sisaWaktu}`}
                                            </span>
                                            <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => navigate('/promo')} className="mt-4 w-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white py-3.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2">
                                <Tag size={16} /> Tindak Lanjuti Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= STATISTIK (DARK CARDS) ================= */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1C1C24] border border-white/5 p-6 rounded-[28px] shadow-lg flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#A7D189]/5 rounded-full blur-2xl group-hover:bg-[#A7D189]/10 transition-colors duration-500"></div>
                    <div className="w-12 h-12 bg-[#A7D189]/10 rounded-[18px] flex items-center justify-center text-[#A7D189] border border-[#A7D189]/20 group-hover:scale-110 transition-transform duration-300">
                        <PackageCheck size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Stok Aman</p>
                        <p className="text-3xl font-black text-white">{inventory.filter(i => i.status === 'Aman').length} Item</p>
                    </div>
                </div>
                <div className="bg-[#1C1C24] border border-white/5 p-6 rounded-[28px] shadow-lg flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors duration-500"></div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-[18px] flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Waste Dicegah</p>
                        <p className="text-3xl font-black text-white">60%</p>
                    </div>
                </div>
            </div>

            {/* ================= GRAFIK (BRIGHT WHITE CARD FOCAL POINT) ================= */}
            <div className="bg-white p-6 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(167,209,137,0.15)] transition-shadow duration-500">
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className="font-black text-[#13131A] flex items-center gap-2 text-base">
                        <BarChart3 size={20} className="text-[#A7D189]" /> Performa Minggu Ini
                    </h3>
                    <button onClick={() => navigate('/statistik')} className="text-[10px] font-bold text-[#13131A] bg-gray-100 px-4 py-2 rounded-xl flex items-center gap-1 hover:bg-gray-200 hover:scale-105 transition-all">
                        Detail <ChevronRight size={14} />
                    </button>
                </div>
                <div className="h-44 w-full relative z-10">
                    <Bar options={chartOptions} data={chartData} />
                </div>
            </div>

            {/* ================= MENU AKSI CEPAT (INTERACTIVE HOVER DARK CARDS) ================= */}
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => navigate('/promo')} className="bg-[#1C1C24] p-6 rounded-[28px] border border-white/5 shadow-lg flex flex-col items-center justify-center gap-3 group hover:bg-[#A7D189] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(167,209,137,0.2)] transition-all duration-300">
                    <div className="p-4 bg-[#252530] text-[#A7D189] rounded-[20px] group-hover:bg-[#13131A] group-hover:text-white transition-colors duration-300"><Tag size={24} /></div>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-[#13131A] tracking-wide transition-colors duration-300">Buat Flash Sale</span>
                </button>
                <button onClick={() => navigate('/donasi')} className="bg-[#1C1C24] p-6 rounded-[28px] border border-white/5 shadow-lg flex flex-col items-center justify-center gap-3 group hover:bg-[#A7D189] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(167,209,137,0.2)] transition-all duration-300">
                    <div className="p-4 bg-[#252530] text-[#A7D189] rounded-[20px] group-hover:bg-[#13131A] group-hover:text-white transition-colors duration-300"><HeartHandshake size={24} /></div>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-[#13131A] tracking-wide transition-colors duration-300">Katalog Donasi</span>
                </button>
            </div>

            {/* ================= MODAL TAMBAH BAHAN (DARK MODE) ================= */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1528]/80 backdrop-blur-md animate-fade-in overflow-y-auto">
                    <div className="bg-[#1C1C24] w-full max-w-sm rounded-[36px] shadow-2xl overflow-hidden animate-slide-down my-8 border border-white/10">
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h3 className="font-black text-white text-lg">Tambah Inventaris</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white bg-[#252530] p-2 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddBahan} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Foto Barang</label>
                                <div className="relative border-2 border-dashed border-gray-600/50 rounded-3xl h-32 flex flex-col items-center justify-center bg-[#252530]/50 group hover:bg-[#252530] hover:border-[#A7D189] transition-all duration-300">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    {newBahan.gambarPreview ? (
                                        <img src={newBahan.gambarPreview} className="absolute inset-0 w-full h-full object-cover rounded-3xl" alt="Preview" />
                                    ) : (
                                        <div className="text-center">
                                            <UploadCloud size={28} className="mx-auto text-gray-500 group-hover:text-[#A7D189] transition-colors" />
                                            <p className="text-[10px] text-gray-400 mt-2 font-bold tracking-wide">Ketuk untuk Upload</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Nama Bahan</label>
                                <input type="text" required value={newBahan.nama} onChange={(e) => setNewBahan({ ...newBahan, nama: e.target.value })} className="w-full px-5 py-4 bg-[#252530] border border-white/5 text-white rounded-2xl text-sm outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all placeholder-gray-500" placeholder="Contoh: Biji Kopi" />
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Stok</label>
                                    <input type="number" required step="0.1" value={newBahan.sisa} onChange={(e) => setNewBahan({ ...newBahan, sisa: e.target.value })} className="w-full px-5 py-4 bg-[#252530] border border-white/5 text-white rounded-2xl text-sm outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all placeholder-gray-500" placeholder="0.0" />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Satuan</label>
                                    <select value={newBahan.satuan} onChange={(e) => setNewBahan({ ...newBahan, satuan: e.target.value })} className="w-full px-4 py-4 bg-[#252530] border border-white/5 text-white rounded-2xl text-sm outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all">
                                        <option value="kg">kg</option><option value="gram">gram</option><option value="Ikat">Ikat</option><option value="Pcs">Pcs</option><option value="Liter">Liter</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Status Stok</label>
                                <select value={newBahan.status} onChange={(e) => setNewBahan({ ...newBahan, status: e.target.value })} className="w-full px-5 py-4 bg-[#252530] border border-white/5 text-white rounded-2xl text-sm outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all">
                                    <option value="Aman">🟢 Aman</option><option value="Kurang">🟡 Kurang (Perlu Restock)</option><option value="Kritis">🔴 Kritis (Hampir Habis)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Kondisi Barang</label>
                                <select value={newBahan.sisaWaktu} onChange={(e) => setNewBahan({ ...newBahan, sisaWaktu: e.target.value })} className="w-full px-5 py-4 bg-[#252530] border border-white/5 text-white rounded-2xl text-sm outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all">
                                    <option value="Aman / Tidak Basi">Awet / Tidak Mudah Basi</option><option value="7 Hari">Sisa 7 Hari Lagi</option><option value="3 Hari">Sisa 3 Hari Lagi</option><option value="1 Hari">Sisa 1 Hari (Mau Basi!)</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full mt-4 py-4 bg-[#A7D189] text-[#13131A] rounded-2xl font-black flex justify-center items-center gap-2 hover:bg-[#95C276] hover:shadow-[0_10px_20px_rgba(167,209,137,0.3)] active:scale-95 transition-all duration-300">
                                <CheckCircle2 size={20} /> Simpan ke Gudang
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <ToastNotification isVisible={isSuccess} message="Bahan berhasil ditambahkan ke gudang!" />
        </div>
    );
};

export default Dashboard;