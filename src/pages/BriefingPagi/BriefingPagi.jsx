import React, { useState, useMemo, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import { Search, ShieldCheck, Tag, HeartHandshake, Trash2, ShoppingCart, RefreshCw, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dummyInventory } from '../../data/dummyInventory';
import { SwipeCard } from '../../components/Cards/SwipeCard';
import { CustomAlert } from '../../components/Modals/CustomAlert';

const BriefingPagi = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [availableItems, setAvailableItems] = useState([]);
    const [disisihkanItems, setDisisihkanItems] = useState([]);
    const [summary, setSummary] = useState({ aman: [] });
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, itemName: '', isBasi: false });
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [buangModal, setBuangModal] = useState({ isOpen: false, idBahan: null, namaBahan: '' });
    const [restockModal, setRestockModal] = useState({ isOpen: false, idBahan: null, namaBahan: '' });

    useEffect(() => {
        const savedInventory = JSON.parse(localStorage.getItem('umkm_inventory')) || dummyInventory;
        const savedDisisihkan = JSON.parse(localStorage.getItem('umkm_disisihkan')) || [];
        setDisisihkanItems(savedDisisihkan);

        const savedQueue = localStorage.getItem('umkm_briefing_queue');
        if (savedQueue) {
            setAvailableItems(JSON.parse(savedQueue));
        } else {
            const disisihkanIds = savedDisisihkan.map(i => i.id);
            const freshQueue = savedInventory.filter(item => !disisihkanIds.includes(item.id));
            setAvailableItems(freshQueue);
            localStorage.setItem('umkm_briefing_queue', JSON.stringify(freshQueue));
        }
    }, []);

    const filteredItems = useMemo(() => availableItems.filter(item => item.nama.toLowerCase().includes(searchQuery.toLowerCase())), [availableItems, searchQuery]);

    useEffect(() => {
        if (filteredItems.length === 0 && !searchQuery) {
            const saved = JSON.parse(localStorage.getItem('umkm_inventory') || '[]');
            const disisihkanIds = disisihkanItems.map(i => i.id);
            const remainingItems = saved.filter(i => !disisihkanIds.includes(i.id));
            setSummary({ aman: remainingItems.filter(i => i.status === 'Aman' && !i.sisaWaktu?.includes('1 Hari')) });
        }
    }, [filteredItems.length, searchQuery, disisihkanItems]);

    const swiped = (direction, idToProcess) => {
        const savedInventory = JSON.parse(localStorage.getItem('umkm_inventory')) || dummyInventory;
        if (direction === 'right') {
            const updated = savedInventory.map(item => item.id === idToProcess ? { ...item, status: 'Aman' } : item);
            localStorage.setItem('umkm_inventory', JSON.stringify(updated));
        } else if (direction === 'left') {
            const itemToSetAside = savedInventory.find(i => i.id === idToProcess);
            if (itemToSetAside) {
                setDisisihkanItems(prev => {
                    const newDisisihkan = [...prev, itemToSetAside];
                    localStorage.setItem('umkm_disisihkan', JSON.stringify(newDisisihkan));
                    return newDisisihkan;
                });
                const angkaHariMatch = itemToSetAside.sisaWaktu ? itemToSetAside.sisaWaktu.match(/\d+/) : null;
                const sisaHari = angkaHariMatch ? parseInt(angkaHariMatch[0], 10) : null;
                const isMauBasi = itemToSetAside.status === 'Kritis' || (sisaHari !== null && sisaHari <= 3);
                setAlertConfig({ isOpen: true, itemName: itemToSetAside.nama, isBasi: isMauBasi });
                setTimeout(() => setAlertConfig(prev => ({ ...prev, isOpen: false })), 3000);
            }
        }
    };

    const outOfFrame = (idToRemove) => {
        setAvailableItems((prevItems) => {
            const newQueue = prevItems.filter(item => item.id !== idToRemove);
            localStorage.setItem('umkm_briefing_queue', JSON.stringify(newQueue));
            return newQueue;
        });
    };

    const executeBuang = () => {
        const id = buangModal.idBahan;
        if (!id) return;
        const saved = JSON.parse(localStorage.getItem('umkm_inventory')) || dummyInventory;
        const updated = saved.filter(i => i.id !== id);
        localStorage.setItem('umkm_inventory', JSON.stringify(updated));
        const newDisisihkan = disisihkanItems.filter(i => i.id !== id);
        setDisisihkanItems(newDisisihkan);
        localStorage.setItem('umkm_disisihkan', JSON.stringify(newDisisihkan));
        const savedQueue = JSON.parse(localStorage.getItem('umkm_briefing_queue') || '[]');
        const updatedQueue = savedQueue.filter(i => i.id !== id);
        localStorage.setItem('umkm_briefing_queue', JSON.stringify(updatedQueue));
        setBuangModal({ isOpen: false, idBahan: null, namaBahan: '' });
    };

    const executeRestock = () => {
        const id = restockModal.idBahan;
        if (!id) return;
        const saved = JSON.parse(localStorage.getItem('umkm_inventory'));
        const updated = saved.map(i => i.id === id ? { ...i, status: 'Kurang' } : i);
        localStorage.setItem('umkm_inventory', JSON.stringify(updated));
        const newDisisihkan = disisihkanItems.filter(i => i.id !== id);
        setDisisihkanItems(newDisisihkan);
        localStorage.setItem('umkm_disisihkan', JSON.stringify(newDisisihkan));
        setRestockModal({ isOpen: false, idBahan: null, namaBahan: '' });
    };

    const executeResetBriefing = () => {
        localStorage.removeItem('umkm_briefing_queue');
        localStorage.removeItem('umkm_disisihkan');
        setIsResetModalOpen(false);
        window.location.reload();
    };

    return (
        // 👇 PERBAIKAN: Padding bawah disesuaikan agar ruang tengah lebih lega
        <div className="absolute inset-0 flex flex-col w-full max-w-md mx-auto overflow-hidden text-white font-sans pb-24 md:pb-6">
            <CustomAlert isOpen={alertConfig.isOpen} onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))} itemName={alertConfig.itemName} isBasi={alertConfig.isBasi} />

            {/* Area Pencarian (Terkunci di Atas) */}
            <div className="flex-none px-6 pt-4 mb-2 relative z-50">
                <div className="relative w-full group">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#A7D189] transition-colors" />
                    <input type="text" placeholder="Cari bahan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-[#1C1C24] border border-white/10 text-white rounded-2xl shadow-lg focus:outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all placeholder-gray-500" />
                </div>
            </div>

            {/* Area Utama (Mengambil Seluruh Sisa Ruang Tengah) */}
            <div className="flex-1 relative w-full flex justify-center items-center">

                {/* JIKA KARTU HABIS (BRIEFING SELESAI) */}
                {filteredItems.length === 0 && (
                    <div className="absolute inset-0 overflow-y-auto custom-scrollbar px-6 pb-6 pt-2">
                        {searchQuery ? (
                            <div className="text-center text-gray-500 mt-20"><p className="text-4xl mb-3">🔍</p><p>Bahan tidak ditemukan.</p><button onClick={() => setSearchQuery('')} className="mt-4 text-[#A7D189] font-bold border-b border-[#A7D189] pb-1">Hapus Pencarian</button></div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-center mb-6 mt-4">
                                    <h2 className="text-3xl font-black text-white tracking-tight">Briefing Selesai!</h2>
                                    <p className="text-sm text-gray-400 mt-1">Berikut hasil audit inventaris dapurmu hari ini.</p>
                                </div>
                                {disisihkanItems.length > 0 && (
                                    <div className="bg-[#1C1C24] border border-orange-500/20 p-5 rounded-[28px] shadow-xl mb-4 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
                                        <h3 className="text-orange-400 font-black flex items-center gap-2 mb-4 relative z-10"><AlertTriangle size={20} /> Disisihkan ({disisihkanItems.length})</h3>
                                        <div className="space-y-3 relative z-10">
                                            {disisihkanItems.map(item => (
                                                <div key={item.id} className="bg-[#252530] p-4 rounded-2xl shadow-sm border border-white/5 flex flex-col gap-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-bold text-white text-base">{item.nama}</p>
                                                            <p className="text-xs text-gray-400 mt-1">Sisa: <span className="font-bold text-gray-200">{item.sisa}</span></p>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-[#13131A] bg-orange-400 px-2 py-1 rounded-lg uppercase tracking-wider">{item.sisaWaktu}</span>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        <button onClick={() => setBuangModal({ isOpen: true, idBahan: item.id, namaBahan: item.nama })} className="flex flex-col items-center justify-center p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white border border-red-500/20 hover:scale-105 transition-all"><Trash2 size={18} className="mb-1.5" /><span className="text-[9px] font-bold uppercase">Buang</span></button>
                                                        <button onClick={() => setRestockModal({ isOpen: true, idBahan: item.id, namaBahan: item.nama })} className="flex flex-col items-center justify-center p-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white border border-blue-500/20 hover:scale-105 transition-all"><ShoppingCart size={18} className="mb-1.5" /><span className="text-[9px] font-bold uppercase">Restock</span></button>
                                                        <button onClick={() => navigate(`/promo/${item.id}?from=briefing`)} className="flex flex-col items-center justify-center p-3 bg-yellow-500/10 text-yellow-400 rounded-xl hover:bg-yellow-500 hover:text-[#13131A] border border-yellow-500/20 hover:scale-105 transition-all"><Tag size={18} className="mb-1.5" /><span className="text-[9px] font-bold uppercase">Promo</span></button>
                                                        <button onClick={() => navigate(`/donasi?itemId=${item.id}&from=briefing`)} className="flex flex-col items-center justify-center p-3 bg-[#A7D189]/10 text-[#A7D189] rounded-xl hover:bg-[#A7D189] hover:text-[#13131A] border border-[#A7D189]/20 hover:scale-105 transition-all"><HeartHandshake size={18} className="mb-1.5" /><span className="text-[9px] font-bold uppercase">Donasi</span></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="bg-[#1C1C24] border border-white/5 p-6 rounded-[28px] shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#A7D189]/5 rounded-full blur-3xl pointer-events-none"></div>
                                    <h3 className="text-[#A7D189] font-black flex items-center gap-2 mb-4 relative z-10"><ShieldCheck size={22} /> Stok Aman ({summary.aman.length})</h3>
                                    <button onClick={() => navigate('/daftar-bahan')} className="w-full mb-3 py-4 bg-[#252530] text-white border border-white/10 rounded-2xl font-bold text-sm hover:bg-white/10 shadow-sm active:scale-95 transition-all relative z-10">Lihat Katalog Inventaris</button>
                                    <button onClick={() => setIsResetModalOpen(true)} className="w-full py-4 bg-[#A7D189] text-[#13131A] rounded-2xl font-black text-sm hover:bg-[#95C276] shadow-[0_10px_20px_rgba(167,209,137,0.2)] flex items-center justify-center gap-2 active:scale-95 transition-all relative z-10"><RefreshCw size={18} /> Mulai Sesi Briefing Baru</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* KARTU SWIPE MUNCUL */}
                {filteredItems.slice().reverse().map((item) => (
                    // 👇 PERBAIKAN: Posisi kartu difokuskan tepat di tengah ruang yang tersisa, 
                    // dan ukurannya dibatasi oleh persentase ruang (h-[75%]), sehingga tidak akan pernah nabrak atas/bawah.
                    <div key={item.id} className="absolute inset-0 flex justify-center items-center px-4 pointer-events-none pb-2">
                        <TinderCard className="pointer-events-auto w-full max-w-[320px] h-[75%] min-h-[350px] max-h-[440px]" onSwipe={(dir) => swiped(dir, item.id)} onCardLeftScreen={() => outOfFrame(item.id)} preventSwipe={['up', 'down']} swipeRequirementType="position" swipeThreshold={100}>
                            <div className="w-full h-full cursor-grab active:cursor-grabbing shadow-[0_15px_40px_rgba(0,0,0,0.6)] rounded-[32px] overflow-hidden bg-[#1C1C24] border border-white/10">
                                <SwipeCard item={item} />
                            </div>
                        </TinderCard>
                    </div>
                ))}
            </div>

            {/* Teks Navigasi Bawah (Terkunci di Bawah) */}
            {filteredItems.length > 0 && (
                <div className="flex-none pt-4 pb-4 flex justify-between px-8 text-sm font-black z-20 pointer-events-none relative">
                    <div className="flex flex-col items-center text-red-400 drop-shadow-xl">
                        <span className="mb-1 tracking-widest text-[10px]">← GESER KIRI</span>
                        <span className="uppercase">Sisihkan</span>
                    </div>
                    <div className="flex flex-col items-center text-[#A7D189] drop-shadow-xl">
                        <span className="mb-1 tracking-widest text-[10px]">GESER KANAN →</span>
                        <span className="uppercase">Stok Aman</span>
                    </div>
                </div>
            )}

            {/* MODAL BUANG */}
            {buangModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0B1528]/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#1C1C24] border border-white/10 w-full max-w-sm rounded-[32px] shadow-2xl p-8 text-center animate-slide-down">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-[20px] flex items-center justify-center mx-auto mb-5 border border-red-500/20"><Trash2 size={32} /></div>
                        <h3 className="font-black text-white text-xl mb-2">Buang Barang?</h3>
                        <p className="text-gray-400 text-sm mb-8 font-medium">Apakah Anda yakin ingin membuang <span className="font-bold text-white">"{buangModal.namaBahan}"</span>? Tindakan ini permanen.</p>
                        <div className="flex gap-3"><button onClick={() => setBuangModal({ isOpen: false, idBahan: null, namaBahan: '' })} className="flex-1 py-4 bg-[#252530] text-gray-300 rounded-2xl font-bold hover:bg-white/10 transition-colors">Batal</button><button onClick={executeBuang} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">Ya, Buang</button></div>
                    </div>
                </div>
            )}

            {/* MODAL RESTOCK */}
            {restockModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0B1528]/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#1C1C24] border border-white/10 w-full max-w-sm rounded-[32px] shadow-2xl p-8 text-center animate-slide-down">
                        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-[20px] flex items-center justify-center mx-auto mb-5 border border-blue-500/20"><ShoppingCart size={32} /></div>
                        <h3 className="font-black text-white text-xl mb-2">Masuk Daftar Belanja?</h3>
                        <p className="text-gray-400 text-sm mb-8 font-medium">Sistem akan mencatat <span className="font-bold text-white">"{restockModal.namaBahan}"</span> ke dalam Daftar Belanja.</p>
                        <div className="flex gap-3"><button onClick={() => setRestockModal({ isOpen: false, idBahan: null, namaBahan: '' })} className="flex-1 py-4 bg-[#252530] text-gray-300 rounded-2xl font-bold hover:bg-white/10 transition-colors">Batal</button><button onClick={executeRestock} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">Ya, Catat</button></div>
                    </div>
                </div>
            )}

            {/* MODAL RESET */}
            {isResetModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0B1528]/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#1C1C24] border border-white/10 w-full max-w-sm rounded-[32px] shadow-2xl p-8 text-center animate-slide-down relative">
                        <button onClick={() => setIsResetModalOpen(false)} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
                        <div className="w-16 h-16 bg-[#A7D189]/10 text-[#A7D189] rounded-[20px] flex items-center justify-center mx-auto mb-5 border border-[#A7D189]/20"><RefreshCw size={32} /></div>
                        <h3 className="font-black text-white text-xl mb-2">Mulai Sesi Baru?</h3>
                        <p className="text-gray-400 text-sm mb-8 font-medium">Tumpukan kartu akan direset sesuai kondisi gudang saat ini.</p>
                        <div className="flex gap-3"><button onClick={() => setIsResetModalOpen(false)} className="flex-1 py-4 bg-[#252530] text-gray-300 rounded-2xl font-bold hover:bg-white/10 transition-colors">Batal</button><button onClick={executeResetBriefing} className="flex-1 py-4 bg-[#A7D189] text-[#13131A] rounded-2xl font-black hover:bg-[#95C276] transition-colors shadow-lg shadow-[#A7D189]/20">Mulai Baru</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BriefingPagi;