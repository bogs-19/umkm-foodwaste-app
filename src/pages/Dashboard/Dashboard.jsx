import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle, TrendingUp, PackageCheck, Tag, Plus, Trash2, X,
    CheckCircle2, HeartHandshake, ChevronRight, UploadCloud,
    Image as ImageIcon, BarChart3
} from 'lucide-react';
import { dummyInventory } from '../../data/dummyInventory';
import { StatistikCard } from '../../components/Cards/StatistikCard';
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

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: { x: { grid: { display: false } }, y: { display: false } }
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
            localStorage.setItem(storageKey, JSON.stringify(updated)); // Simpan ke brankas spesifik
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
            gambar: newBahan.gambarPreview || `https://placehold.co/400x300/e2e8f0/475569?text=${encodeURIComponent(newBahan.nama)}`
        };

        const updated = [dataBaru, ...inventory];
        setInventory(updated);
        setBahanKritis(updated.filter(item => item.status === 'Kritis' || item.status === 'Kurang'));

        localStorage.setItem(storageKey, JSON.stringify(updated)); // Simpan ke brankas spesifik

        setIsAddModalOpen(false);
        setNewBahan({ nama: '', sisa: '', satuan: 'kg', sisaWaktu: 'Aman / Tidak Basi', status: 'Aman', gambarPreview: '' });

        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2500);
    };

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto space-y-6 pb-24 relative px-4 pt-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-gray-800 tracking-tight">Halo, {userName}!</h2>
                    <p className="text-gray-500 text-sm mt-1">Berikut ringkasan dapurmu hari ini.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="w-12 h-12 bg-[#1A361D] text-white rounded-2xl shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
                    <Plus size={24} />
                </button>
            </div>

            {bahanKritis.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-2xl shadow-sm animate-fade-in">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="h-6 w-6 text-red-500 shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider">Aksi Mendesak</h3>
                            <div className="mt-2 space-y-2">
                                {bahanKritis.slice(0, 2).map((item) => (
                                    <div key={item.id} className="flex justify-between items-center bg-white/60 p-2 rounded-xl">
                                        <span className="text-sm font-semibold text-gray-800">{item.nama}</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold px-2 py-1 rounded-md text-[10px] ${item.status === 'Kurang' ? 'text-orange-600 bg-orange-100' : 'text-red-600 bg-white'}`}>
                                                {item.status === 'Kurang' ? 'Restock!' : `Sisa: ${item.sisaWaktu}`}
                                            </span>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-400 p-1 hover:text-red-600"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => navigate('/promo')} className="mt-4 w-full bg-red-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2">
                                <Tag size={14} /> Tindak Lanjuti Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <StatistikCard icon={<PackageCheck size={24} />} title="Stok Aman" value={`${inventory.filter(i => i.status === 'Aman').length} Item`} colorClass="text-green-600" />
                <StatistikCard icon={<TrendingUp size={24} />} title="Waste Dicegah" value="60%" colorClass="text-blue-600" />
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <BarChart3 size={18} className="text-[#A7D189]" /> Performa Minggu Ini
                    </h3>
                    <button onClick={() => navigate('/statistik')} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-blue-100">
                        Detail <ChevronRight size={12} />
                    </button>
                </div>
                <div className="h-40 w-full"><Bar options={chartOptions} data={chartData} /></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => navigate('/promo')} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-2 group hover:border-[#A7D189] transition-all">
                    <div className="p-3 bg-red-50 text-red-500 rounded-2xl group-hover:scale-110 transition-transform"><Tag size={24} /></div>
                    <span className="text-xs font-bold text-gray-700">Buat Flash Sale</span>
                </button>
                <button onClick={() => navigate('/donasi')} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-2 group hover:border-[#A7D189] transition-all">
                    <div className="p-3 bg-green-50 text-green-600 rounded-2xl group-hover:scale-110 transition-transform"><HeartHandshake size={24} /></div>
                    <span className="text-xs font-bold text-gray-700">Katalog Donasi</span>
                </button>
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-slide-down my-8">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800">Tambah Inventaris Baru</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 bg-white p-1 rounded-full shadow-sm"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddBahan} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Foto Barang</label>
                                <div className="relative border-2 border-dashed border-gray-200 rounded-2xl h-32 flex flex-col items-center justify-center bg-gray-50 group hover:bg-green-50 hover:border-[#A7D189] transition-all">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    {newBahan.gambarPreview ? (
                                        <img src={newBahan.gambarPreview} className="absolute inset-0 w-full h-full object-cover rounded-2xl" alt="Preview" />
                                    ) : (
                                        <div className="text-center">
                                            <UploadCloud size={24} className="mx-auto text-gray-400 group-hover:text-[#A7D189]" />
                                            <p className="text-[10px] text-gray-500 mt-1 font-bold tracking-tight">Upload Foto</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Nama Bahan</label>
                                <input type="text" required value={newBahan.nama} onChange={(e) => setNewBahan({ ...newBahan, nama: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#A7D189]" />
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Stok</label>
                                    <input type="number" required step="0.1" value={newBahan.sisa} onChange={(e) => setNewBahan({ ...newBahan, sisa: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#A7D189]" />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Satuan</label>
                                    <select value={newBahan.satuan} onChange={(e) => setNewBahan({ ...newBahan, satuan: e.target.value })} className="w-full px-2 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#A7D189]">
                                        <option value="kg">kg</option><option value="gram">gram</option><option value="Ikat">Ikat</option><option value="Pcs">Pcs</option><option value="Liter">Liter</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Status Stok</label>
                                <select value={newBahan.status} onChange={(e) => setNewBahan({ ...newBahan, status: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#A7D189] transition-all">
                                    <option value="Aman">🟢 Aman</option><option value="Kurang">🟡 Kurang (Perlu Restock)</option><option value="Kritis">🔴 Kritis (Hampir Habis)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">Kondisi Barang</label>
                                <select value={newBahan.sisaWaktu} onChange={(e) => setNewBahan({ ...newBahan, sisaWaktu: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#A7D189] transition-all">
                                    <option value="Aman / Tidak Basi">Awet / Tidak Mudah Basi</option><option value="7 Hari">Sisa 7 Hari Lagi</option><option value="3 Hari">Sisa 3 Hari Lagi</option><option value="1 Hari">Sisa 1 Hari (Mau Basi!)</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full mt-2 py-4 bg-[#1A361D] text-white rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-[#122614] shadow-lg active:scale-95 transition-all">
                                <CheckCircle2 size={18} /> Simpan ke Gudang
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