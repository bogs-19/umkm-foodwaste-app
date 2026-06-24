import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Tag, Info, CheckCircle2, Image as ImageIcon, ShieldCheck, AlertTriangle, Plus, X, ChevronRight, Sparkles, Trash2 } from 'lucide-react';
import { ToastNotification } from '../../components/Modals/ToastNotification';
import { PromoPoster } from '../../components/Cards/PromoPoster';
import { dummyInventory } from '../../data/dummyInventory';
import html2canvas from 'html2canvas';

const EksekusiPromo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const fromWhere = queryParams.get('from');

    const [diskon, setDiskon] = useState(30);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const posterRef = useRef(null);
    const [itemKritis, setItemKritis] = useState(null);

    const [inventory, setInventory] = useState([]);
    const [rekomendasiPromo, setRekomendasiPromo] = useState([]);
    const [promoAktif, setPromoAktif] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ idBahan: '' });
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleBack = () => {
        if (fromWhere === 'briefing') navigate('/briefing');
        else if (id) navigate('/promo');
        else navigate('/dashboard');
    };

    useEffect(() => {
        const savedInventory = localStorage.getItem('umkm_inventory');
        const inventoryData = savedInventory ? JSON.parse(savedInventory) : dummyInventory;
        setInventory(inventoryData);

        if (id) {
            const foundItem = inventoryData.find(item => item.id.toString() === id.toString());
            setItemKritis(foundItem || null);
        } else {
            const aktif = inventoryData.filter(item => item.sisaWaktu?.includes('Sedang Promo'));
            const rekomendasi = inventoryData.filter(item => {
                if (item.sisaWaktu?.includes('Sedang Promo')) return false;
                const angkaHariMatch = item.sisaWaktu ? item.sisaWaktu.match(/\d+/) : null;
                const sisaHari = angkaHariMatch ? parseInt(angkaHariMatch[0], 10) : null;
                return (sisaHari !== null && sisaHari <= 3) || item.status === 'Kritis';
            });
            setPromoAktif(aktif);
            setRekomendasiPromo(rekomendasi);
        }
        setIsLoading(false);
    }, [id]);

    const handleTerapkan = () => {
        const savedPromos = JSON.parse(localStorage.getItem('umkm_promos') || '[]');
        const today = new Date();
        const promoBaru = { id: Date.now(), idBahan: itemKritis.id, namaBahan: itemKritis.nama, diskon: diskon, sisaStok: itemKritis.sisa, tanggal: today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), status: 'Aktif' };
        localStorage.setItem('umkm_promos', JSON.stringify([promoBaru, ...savedPromos]));

        const savedInventory = JSON.parse(localStorage.getItem('umkm_inventory') || '[]');
        const updatedInventory = savedInventory.map(item => item.id === itemKritis.id ? { ...item, status: 'Aman', sisaWaktu: '🌟 Sedang Promo' } : item);
        localStorage.setItem('umkm_inventory', JSON.stringify(updatedInventory));

        const savedDisisihkan = JSON.parse(localStorage.getItem('umkm_disisihkan') || '[]');
        const updatedDisisihkan = savedDisisihkan.filter(i => i.id !== itemKritis.id);
        localStorage.setItem('umkm_disisihkan', JSON.stringify(updatedDisisihkan));

        setIsSuccess(true);
    };

    const triggerHapusPromo = (idBahan) => { setItemToDelete(idBahan); setIsConfirmModalOpen(true); };
    const executeHapusPromo = () => {
        if (!itemToDelete) return;
        const savedInventory = JSON.parse(localStorage.getItem('umkm_inventory') || '[]');
        const updatedInventory = savedInventory.map(item => item.id === itemToDelete ? { ...item, status: 'Aman', sisaWaktu: 'Aman / Tidak Basi' } : item);
        localStorage.setItem('umkm_inventory', JSON.stringify(updatedInventory));
        setInventory(updatedInventory);

        const aktif = updatedInventory.filter(item => item.sisaWaktu?.includes('Sedang Promo'));
        const rekomendasi = updatedInventory.filter(item => {
            if (item.sisaWaktu?.includes('Sedang Promo')) return false;
            const angkaHariMatch = item.sisaWaktu ? item.sisaWaktu.match(/\d+/) : null;
            const sisaHari = angkaHariMatch ? parseInt(angkaHariMatch[0], 10) : null;
            return (sisaHari !== null && sisaHari <= 3) || item.status === 'Kritis';
        });
        setPromoAktif(aktif); setRekomendasiPromo(rekomendasi); setIsConfirmModalOpen(false); setItemToDelete(null);
    };

    const handleDownloadPoster = async () => {
        if (!posterRef.current) return;
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(posterRef.current, { scale: 2, useCORS: true, backgroundColor: '#0B1528' });
            const link = document.createElement('a'); link.href = canvas.toDataURL('image/png');
            link.download = `PROMO-${itemKritis.nama.replace(/\s+/g, '-').toUpperCase()}-${diskon}.png`;
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
        } catch (error) { alert("Gagal membuat poster."); } finally { setIsDownloading(false); }
    };

    const handleLanjutPromoManual = (e) => { e.preventDefault(); if (!formData.idBahan) return; setIsModalOpen(false); navigate(`/promo/${formData.idBahan}`); };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#A7D189]"></div></div>;

    if (!id) {
        return (
            <div className="flex flex-col min-h-full w-full max-w-md mx-auto relative overflow-x-hidden pb-24 px-4 pt-6 text-white font-sans">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={handleBack} className="p-2 bg-[#1C1C24] border border-white/5 rounded-full hover:bg-white/10 transition-colors"><ArrowLeft size={20} className="text-gray-300" /></button>
                    <h2 className="text-2xl font-black tracking-wide text-white">Manajemen Promo</h2>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-[24px] p-5 flex gap-4 items-start mb-6 shadow-lg">
                    <AlertTriangle size={24} className="text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-100/80 font-medium leading-relaxed">Sistem merekomendasikan barang dengan sisa kedaluwarsa <strong>maksimal 3 hari</strong> untuk dipromosikan segera.</p>
                </div>

                <button onClick={() => setIsModalOpen(true)} className="w-full mb-8 py-4 bg-[#A7D189] text-[#13131A] rounded-[20px] font-black flex justify-center items-center gap-2 hover:bg-[#95C276] shadow-[0_10px_20px_rgba(167,209,137,0.2)] active:scale-95 transition-all">
                    <Plus size={22} className="stroke-[3px]" /> Tambah Promo Manual
                </button>

                <div className="mb-8">
                    <h3 className="font-black text-white text-sm mb-4 flex items-center gap-2 uppercase tracking-widest"><Sparkles size={18} className="text-yellow-400" /> Sedang Dipromosikan ({promoAktif.length})</h3>
                    {promoAktif.length === 0 ? <p className="text-xs text-gray-500 font-medium bg-[#1C1C24] border border-dashed border-white/10 p-6 rounded-[24px] text-center">Belum ada promo yang aktif di kasir.</p> : (
                        <div className="space-y-3">{promoAktif.map((item) => (
                            <div key={item.id} className="bg-[#1C1C24] rounded-[24px] p-4 flex items-center justify-between shadow-lg border border-yellow-500/30 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none"></div>
                                <div className="flex items-center gap-4 flex-1 pr-2 relative z-10">
                                    <div className="w-16 h-16 rounded-[18px] overflow-hidden bg-[#252530] border border-white/5"><img src={item.gambar} alt={item.nama} className="w-full h-full object-cover" /></div>
                                    <div><h3 className="font-bold text-white text-base">{item.nama}</h3><p className="text-xs text-gray-400 mt-1">Sisa Stok: <span className="font-bold text-gray-200">{item.sisa}</span></p><span className="text-[9px] font-black text-[#13131A] bg-yellow-400 px-2 py-1 rounded-md mt-2 inline-block uppercase tracking-wider">Flash Sale Aktif</span></div>
                                </div>
                                <button onClick={() => triggerHapusPromo(item.id)} className="p-3 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 rounded-xl transition-all relative z-10" title="Hentikan Promo"><Trash2 size={20} /></button>
                            </div>
                        ))}</div>
                    )}
                </div>

                <h3 className="font-black text-white text-sm mb-4 uppercase tracking-widest text-red-400">🚨 Rekomendasi Mendesak ({rekomendasiPromo.length})</h3>
                {rekomendasiPromo.length === 0 ? <div className="bg-[#A7D189]/10 p-6 rounded-[24px] text-center border border-[#A7D189]/20 shadow-lg"><ShieldCheck size={32} className="text-[#A7D189] mx-auto mb-3" /><p className="text-sm text-[#A7D189] font-medium">Gudang aman, tidak ada barang mendesak (H-3).</p></div> : (
                    <div className="space-y-3">{rekomendasiPromo.map((item) => (
                        <div key={item.id} onClick={() => navigate(`/promo/${item.id}`)} className="bg-[#1C1C24] rounded-[24px] p-4 flex items-center justify-between shadow-lg border border-red-500/20 cursor-pointer hover:border-red-500/50 hover:bg-[#252530] group transition-all relative overflow-hidden hover:-translate-y-1">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
                            <div className="flex items-center gap-4 pl-2 relative z-10">
                                <div className="w-16 h-16 rounded-[18px] overflow-hidden bg-[#13131A] border border-white/5"><img src={item.gambar} alt={item.nama} className="w-full h-full object-cover" /></div>
                                <div><h3 className="font-bold text-white text-base group-hover:text-red-400 transition-colors">{item.nama}</h3><div className="flex items-center gap-3 mt-2"><span className="px-2 py-1 rounded-md text-[9px] font-black bg-red-500/20 border border-red-500/30 text-red-400 uppercase tracking-wider">{item.sisaWaktu}</span><span className="text-xs text-gray-400">Stok: {item.sisa}</span></div></div>
                            </div>
                            <ChevronRight size={22} className="text-gray-500 group-hover:text-red-400 relative z-10 transition-colors" />
                        </div>
                    ))}</div>
                )}

                {/* MODAL MANUAL */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1528]/80 backdrop-blur-md">
                        <div className="bg-[#1C1C24] w-full max-w-sm rounded-[32px] shadow-2xl border border-white/10 overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-white/5">
                                <h3 className="font-black text-white flex items-center gap-2"><Tag size={20} className="text-[#A7D189]" /> Pilih Manual</h3>
                                <button onClick={() => { setIsModalOpen(false); setFormData({ idBahan: '' }); }} className="text-gray-500 hover:text-white"><X size={22} /></button>
                            </div>
                            <form onSubmit={handleLanjutPromoManual} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Inventaris Gudang</label>
                                    <select required value={formData.idBahan} onChange={(e) => setFormData({ idBahan: e.target.value })} className="w-full px-4 py-4 bg-[#252530] border border-white/5 text-white rounded-2xl text-sm focus:ring-1 focus:ring-[#A7D189] outline-none appearance-none">
                                        <option value="" disabled>-- Pilih Barang --</option>
                                        {inventory.filter(item => !item.sisaWaktu?.includes('Sedang Promo')).map(item => (<option key={item.id} value={item.id}>{item.nama} (Stok: {item.sisa})</option>))}
                                    </select>
                                </div>
                                <button type="submit" className="w-full py-4 bg-[#A7D189] text-[#13131A] rounded-2xl font-black flex justify-center items-center gap-2 hover:bg-[#95C276] shadow-lg shadow-[#A7D189]/20 transition-all">Lanjut Eksekusi <ChevronRight size={20} className="stroke-[3px]" /></button>
                            </form>
                        </div>
                    </div>
                )}
                {/* MODAL HAPUS */}
                {isConfirmModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1528]/80 backdrop-blur-md">
                        <div className="bg-[#1C1C24] w-full max-w-sm rounded-[32px] shadow-2xl p-8 text-center border border-white/10">
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[20px] flex items-center justify-center mx-auto mb-5"><AlertTriangle size={32} /></div>
                            <h3 className="font-black text-white text-xl mb-2">Hentikan Promo?</h3>
                            <p className="text-gray-400 text-sm mb-8 font-medium">Promo untuk bahan ini akan dihentikan dan statusnya kembali normal.</p>
                            <div className="flex gap-3"><button onClick={() => { setIsConfirmModalOpen(false); setItemToDelete(null); }} className="flex-1 py-4 bg-[#252530] text-gray-300 rounded-2xl font-bold hover:bg-white/10 transition-colors">Batal</button><button onClick={executeHapusPromo} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">Ya, Hentikan</button></div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // --- MODE 2: EDITOR ---
    if (id && !itemKritis) return <div className="flex justify-center items-center h-screen text-white">Bahan tidak ditemukan</div>;

    return (
        <div className="flex flex-col min-h-full w-full max-w-md mx-auto relative overflow-x-hidden pb-24 px-4 pt-6 text-white font-sans">
            <PromoPoster ref={posterRef} itemKritis={itemKritis} diskon={diskon} />
            <div className="flex items-center gap-4 mb-6 mt-6">
                <button onClick={handleBack} className="p-2 bg-[#1C1C24] border border-white/5 rounded-full shadow-sm hover:bg-white/10 transition-colors"><ArrowLeft size={20} className="text-gray-300" /></button>
                <h2 className="text-2xl font-black tracking-wide">Tindakan Cepat</h2>
            </div>

            <div className="bg-[#1C1C24] rounded-[28px] p-6 shadow-lg border border-white/5 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#A7D189]/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10"><span className="px-3 py-1 text-[10px] font-black rounded-lg mb-3 inline-block bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase tracking-widest">{itemKritis.sisaWaktu}</span><h3 className="text-2xl font-black text-white">{itemKritis.nama}</h3><p className="text-gray-400 text-sm mt-2 font-medium">Sisa Stok: <span className="font-bold text-gray-200">{itemKritis.sisa}</span></p></div>
            </div>

            <div className="bg-[#1C1C24] rounded-[32px] p-6 shadow-lg border border-white/5 flex-1 relative">
                <label className="text-white font-black mb-6 flex items-center gap-2 text-lg"><Tag size={20} className="text-[#A7D189]" /> Atur Besaran Diskon</label>
                <div className="flex items-center gap-4 mb-10">
                    <input type="range" min="10" max="70" step="5" value={diskon} disabled={isSuccess} onChange={(e) => setDiskon(e.target.value)} className="w-full h-3 rounded-full bg-[#13131A] accent-[#A7D189] appearance-none" />
                    <span className="text-3xl font-black text-[#A7D189] w-20 text-right">{diskon}%</span>
                </div>

                {!isSuccess ? (
                    <button onClick={handleTerapkan} className="w-full py-4.5 bg-[#A7D189] text-[#13131A] rounded-[20px] font-black hover:bg-[#95C276] shadow-[0_10px_20px_rgba(167,209,137,0.2)] active:scale-95 transition-all text-lg">Terapkan Flash Sale!</button>
                ) : (
                    <div className="space-y-4 animate-fade-in">
                        <div className="w-full py-4 bg-[#A7D189]/10 text-[#A7D189] border border-[#A7D189]/30 rounded-[20px] font-black flex justify-center items-center gap-2"><CheckCircle2 size={24} /> Promo Aktif!</div>
                        <button onClick={handleDownloadPoster} disabled={isDownloading} className="w-full py-4 bg-[#2563EB] text-white rounded-[20px] font-black flex justify-center items-center gap-2 hover:bg-blue-600 shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all"><ImageIcon size={22} /> Unduh Poster Promo</button>
                        <button onClick={handleBack} className="w-full py-4 bg-[#252530] hover:bg-white/10 text-white font-bold rounded-[20px] flex justify-center items-center gap-2 transition-all">Kembali ke {fromWhere === 'briefing' ? 'Layar Briefing' : 'Daftar Promo'}</button>
                    </div>
                )}
            </div>
            <ToastNotification isVisible={isSuccess} message="Sinkronisasi ke kasir berhasil..." />
        </div>
    );
};

export default EksekusiPromo;