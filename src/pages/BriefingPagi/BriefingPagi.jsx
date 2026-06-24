import React, { useState, useMemo, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import { Search, ShieldCheck, Tag, HeartHandshake, Trash2, ShoppingCart, RefreshCw, X, AlertTriangle, Info } from 'lucide-react';
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

    // STATE UNTUK CUSTOM MODALS
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    // STATE MODAL BUANG
    const [buangModal, setBuangModal] = useState({ isOpen: false, idBahan: null, namaBahan: '' });

    // STATE MODAL RESTOCK
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

    const filteredItems = useMemo(() => {
        return availableItems.filter(item =>
            item.nama.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [availableItems, searchQuery]);

    useEffect(() => {
        if (filteredItems.length === 0 && !searchQuery) {
            const saved = JSON.parse(localStorage.getItem('umkm_inventory') || '[]');
            const disisihkanIds = disisihkanItems.map(i => i.id);
            const remainingItems = saved.filter(i => !disisihkanIds.includes(i.id));

            setSummary({
                aman: remainingItems.filter(i => i.status === 'Aman' && !i.sisaWaktu?.includes('1 Hari'))
            });
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

    // ==========================================
    // LOGIKA EKSEKUSI (DIPANGGIL DARI MODAL)
    // ==========================================
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
        // Ubah status menjadi Kurang agar masuk ke halaman Daftar Belanja
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
        <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-md mx-auto relative overflow-hidden">
            <CustomAlert isOpen={alertConfig.isOpen} onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))} itemName={alertConfig.itemName} isBasi={alertConfig.isBasi} />

            <div className="flex-none mb-6 px-6 pt-2 relative z-50">
                <div className="relative w-full">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Cari bahan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A7D189]" />
                </div>
            </div>

            <div className="flex-1 relative flex justify-center items-center w-full min-h-[420px] touch-none px-6">
                {filteredItems.length === 0 && (
                    <div className="w-full h-full flex flex-col justify-start pt-4 animate-slide-up overflow-y-auto pb-10 scrollbar-hide">
                        {searchQuery ? (
                            <div className="text-center text-gray-500 mt-20"><p className="text-4xl mb-3">🔍</p><p>Bahan tidak ditemukan.</p><button onClick={() => setSearchQuery('')} className="mt-2 text-[#1A361D] font-bold underline">Hapus Pencarian</button></div>
                        ) : (
                            <div className="space-y-4">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Briefing Selesai!</h2>
                                    <p className="text-sm text-gray-500">Berikut hasil audit inventaris dapurmu hari ini.</p>
                                </div>
                                {disisihkanItems.length > 0 && (
                                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl shadow-sm mb-4">
                                        <h3 className="text-orange-800 font-bold flex items-center gap-2 mb-3">📦 Disisihkan ({disisihkanItems.length})</h3>
                                        <div className="space-y-3">
                                            {disisihkanItems.map(item => (
                                                <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-orange-200 flex flex-col gap-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-bold text-gray-800 text-sm">{item.nama}</p>
                                                            <p className="text-xs text-gray-500">Sisa: <span className="font-bold text-gray-700">{item.sisa}</span></p>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-white bg-orange-400 px-2 py-0.5 rounded-full">{item.sisaWaktu}</span>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-1.5">

                                                        {/* TRIGGER MODAL BUANG */}
                                                        <button onClick={() => setBuangModal({ isOpen: true, idBahan: item.id, namaBahan: item.nama })} className="flex flex-col items-center justify-center p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 border border-gray-100 transition-colors">
                                                            <Trash2 size={16} className="mb-1" /><span className="text-[9px] font-bold">Buang</span>
                                                        </button>

                                                        {/* TRIGGER MODAL RESTOCK */}
                                                        <button onClick={() => setRestockModal({ isOpen: true, idBahan: item.id, namaBahan: item.nama })} className="flex flex-col items-center justify-center p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 border border-yellow-100 transition-colors">
                                                            <ShoppingCart size={16} className="mb-1" /><span className="text-[9px] font-bold">Restock</span>
                                                        </button>

                                                        <button onClick={() => navigate(`/promo/${item.id}?from=briefing`)} className="flex flex-col items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-100 transition-colors"><Tag size={16} className="mb-1" /><span className="text-[9px] font-bold">Promo</span></button>
                                                        <button onClick={() => navigate(`/donasi?itemId=${item.id}&from=briefing`)} className="flex flex-col items-center justify-center p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 border border-green-100 transition-colors"><HeartHandshake size={16} className="mb-1" /><span className="text-[9px] font-bold">Donasi</span></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="bg-green-50 border border-green-100 p-5 rounded-2xl shadow-sm">
                                    <h3 className="text-green-700 font-bold flex items-center gap-2 mb-2"><ShieldCheck size={18} /> Stok Aman ({summary.aman.length})</h3>

                                    <button onClick={() => navigate('/daftar-bahan')} className="w-full mt-2 mb-2 py-2.5 bg-white text-green-700 border border-green-200 rounded-xl font-bold text-sm hover:bg-green-100 shadow-sm active:scale-95 transition-all">Lihat Katalog Inventaris</button>

                                    <button onClick={() => setIsResetModalOpen(true)} className="w-full mt-2 py-2.5 bg-green-700 text-white rounded-xl font-bold text-sm hover:bg-green-800 shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all">
                                        <RefreshCw size={16} /> Mulai Sesi Briefing Baru
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {filteredItems.slice().reverse().map((item) => (
                    <TinderCard className="absolute w-[100%] max-w-[340px] h-[440px]" key={item.id} onSwipe={(dir) => swiped(dir, item.id)} onCardLeftScreen={() => outOfFrame(item.id)} preventSwipe={['up', 'down']} swipeRequirementType="position" swipeThreshold={100}>
                        <div className="w-full h-full cursor-grab active:cursor-grabbing touch-pan-y shadow-2xl rounded-3xl overflow-hidden bg-white border border-gray-100"><SwipeCard item={item} /></div>
                    </TinderCard>
                ))}
            </div>

            {filteredItems.length > 0 && (
                <div className="flex-none mt-auto pt-8 flex justify-between px-8 text-sm font-bold z-10 transition-opacity pointer-events-none pb-4">
                    <div className="flex flex-col items-center text-orange-400"><span className="mb-1 tracking-widest text-[10px]">← GESER KIRI</span><span>SISIHKAN</span></div>
                    <div className="flex flex-col items-center text-[#1A361D]"><span className="mb-1 tracking-widest text-[10px]">GESER KANAN →</span><span>STOK AMAN</span></div>
                </div>
            )}

            {/* ================================================================= */}
            {/* KUMPULAN CUSTOM MODALS BAWAH */}
            {/* ================================================================= */}

            {/* 1. MODAL KONFIRMASI BUANG BARANG */}
            {buangModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center animate-slide-down relative">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-xl mb-2">Buang Barang?</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            Apakah Anda yakin ingin membuang <span className="font-bold text-gray-800">"{buangModal.namaBahan}"</span>? Tindakan ini akan menghapusnya secara permanen dari inventaris.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setBuangModal({ isOpen: false, idBahan: null, namaBahan: '' })} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">Batal</button>
                            <button onClick={executeBuang} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md">Ya, Buang</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. MODAL KONFIRMASI RESTOCK BARANG */}
            {restockModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center animate-slide-down relative">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart size={32} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-xl mb-2">Masuk Daftar Belanja?</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            Sistem akan mencatat <span className="font-bold text-gray-800">"{restockModal.namaBahan}"</span> ke dalam Daftar Belanja (Restock). Segera beli di pasar, ya!
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setRestockModal({ isOpen: false, idBahan: null, namaBahan: '' })} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">Batal</button>
                            <button onClick={executeRestock} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md">Ya, Catat</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. MODAL KONFIRMASI MULAI SESI BRIEFING BARU */}
            {isResetModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center animate-slide-down relative">
                        <button onClick={() => setIsResetModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={20} />
                        </button>
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <RefreshCw size={32} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-xl mb-2">Mulai Sesi Baru?</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            Tumpukan kartu akan direset sesuai kondisi gudang saat ini. Item yang telah disisihkan akan dikembalikan ke tumpukan.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsResetModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">Batal</button>
                            <button onClick={executeResetBriefing} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-md">Ya, Mulai Baru</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BriefingPagi;