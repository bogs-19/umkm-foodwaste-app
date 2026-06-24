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
    const location = useLocation(); // BACA LOKASI
    const queryParams = new URLSearchParams(location.search);
    const fromWhere = queryParams.get('from'); // BACA JEJAK

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

    // LOGIKA TOMBOL KEMBALI DINAMIS (KUNCI UX)
    const handleBack = () => {
        if (fromWhere === 'briefing') {
            navigate('/briefing');
        } else if (id) {
            navigate('/promo');
        } else {
            navigate('/dashboard');
        }
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

        // HAPUS DARI KERANJANG DISISIHKAN BRIEFING AGAR TIDAK MUNCUL LAGI
        const savedDisisihkan = JSON.parse(localStorage.getItem('umkm_disisihkan') || '[]');
        const updatedDisisihkan = savedDisisihkan.filter(i => i.id !== itemKritis.id);
        localStorage.setItem('umkm_disisihkan', JSON.stringify(updatedDisisihkan));

        setIsSuccess(true);
    };

    // Fungsi handleHapusPromo & handleLanjutPromoManual tetap utuh
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

    const handleDownloadPoster = async () => { /* Logika Canvas Tetap Sama */
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

    if (isLoading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A361D]"></div></div>;

    // --- MODE 1: LIST PROMO UTAMA ---
    if (!id) {
        return (
            <div className="flex flex-col min-h-full w-full max-w-md mx-auto relative overflow-x-hidden pb-24 px-4 pt-6">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={handleBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"><ArrowLeft size={20} className="text-gray-700" /></button>
                    <h2 className="text-2xl font-bold text-gray-800">Manajemen Promo</h2>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3 items-start mb-6"><AlertTriangle size={20} className="text-yellow-600 shrink-0 mt-0.5" /><p className="text-xs text-yellow-800 font-medium">Sistem hanya merekomendasikan barang dengan sisa waktu kedaluwarsa/habis <strong>maksimal 3 hari</strong> untuk dipromosikan segera.</p></div>
                <button onClick={() => setIsModalOpen(true)} className="w-full mb-8 py-4 bg-[#A7D189] text-[#1A361D] rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#95C276] shadow-md"><Plus size={20} /> Tambah Promo Manual</button>

                <div className="mb-8">
                    <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2"><Sparkles size={16} className="text-yellow-500" /> Sedang Dipromosikan ({promoAktif.length})</h3>
                    {promoAktif.length === 0 ? <p className="text-xs text-gray-400 italic bg-white border border-dashed border-gray-200 p-4 rounded-xl text-center">Belum ada promo yang aktif di kasir.</p> : (
                        <div className="space-y-3">{promoAktif.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-yellow-300 relative overflow-hidden group">
                                <div className="flex items-center gap-4 flex-1 pr-2"><div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-yellow-100 p-0.5"><img src={item.gambar} alt={item.nama} className="w-full h-full object-cover rounded-lg" /></div><div><h3 className="font-bold text-gray-800 text-base">{item.nama}</h3><p className="text-xs text-gray-500 mt-1">Sisa Stok: <span className="font-bold text-gray-700">{item.sisa}</span></p><span className="text-[10px] font-bold text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded mt-1 inline-block">Flash Sale Aktif</span></div></div>
                                <button onClick={() => triggerHapusPromo(item.id)} className="p-2 text-gray-400 hover:text-red-500 bg-red-50 rounded-xl" title="Hentikan Promo"><Trash2 size={18} /></button>
                            </div>
                        ))}</div>
                    )}
                </div>

                <h3 className="font-bold text-gray-800 text-sm mb-3">🚨 Rekomendasi Mendesak ({rekomendasiPromo.length})</h3>
                {rekomendasiPromo.length === 0 ? <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100"><ShieldCheck size={24} className="text-green-500 mx-auto mb-2" /><p className="text-xs text-green-700 font-medium">Gudang aman, tidak ada barang mendesak (H-3).</p></div> : (
                    <div className="space-y-3">{rekomendasiPromo.map((item) => (
                        <div key={item.id} onClick={() => navigate(`/promo/${item.id}`)} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-red-100 cursor-pointer hover:border-red-300 group relative overflow-hidden"><div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400"></div><div className="flex items-center gap-4 pl-2"><div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100"><img src={item.gambar} alt={item.nama} className="w-full h-full object-cover" /></div><div><h3 className="font-bold text-gray-800 text-base group-hover:text-red-700">{item.nama}</h3><div className="flex items-center gap-2 mt-1"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600">Sisa: {item.sisaWaktu}</span><span className="text-xs text-gray-500">Stok: {item.sisa}</span></div></div></div><ChevronRight size={20} className="text-gray-300 group-hover:text-red-500" /></div>
                    ))}</div>
                )}

                {/* MODAL MANUAL */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"><div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"><div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50"><h3 className="font-bold text-gray-800 flex items-center gap-2"><Tag size={18} className="text-[#A7D189]" /> Pilih Bahan Manual</h3><button onClick={() => { setIsModalOpen(false); setSelectedBahanId(''); }} className="text-gray-400 hover:text-red-500"><X size={20} /></button></div><form onSubmit={handleLanjutPromoManual} className="p-5 space-y-4"><div><label className="block text-xs font-bold text-gray-500 mb-2">INVENTARIS GUDANG</label><select required value={selectedBahanId} onChange={(e) => setSelectedBahanId(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#A7D189]"><option value="" disabled>-- Pilih Barang --</option>{inventory.filter(item => !item.sisaWaktu?.includes('Sedang Promo')).map(item => (<option key={item.id} value={item.id}>{item.nama} (Stok: {item.sisa})</option>))}</select></div><button type="submit" className="w-full mt-2 py-3 bg-[#1A361D] text-white rounded-xl font-bold flex justify-center items-center gap-2">Lanjut Eksekusi Promo <ChevronRight size={18} /></button></form></div></div>
                )}
                {/* MODAL HAPUS */}
                {isConfirmModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"><div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center"><div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} /></div><h3 className="font-bold text-gray-800 text-xl mb-2">Hentikan Promo?</h3><p className="text-gray-500 text-sm mb-6">Promo diskon untuk bahan ini akan dihentikan dan statusnya dikembalikan normal.</p><div className="flex gap-3"><button onClick={() => { setIsConfirmModalOpen(false); setItemToDelete(null); }} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold">Batal</button><button onClick={executeHapusPromo} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Ya, Hentikan</button></div></div></div>
                )}
            </div>
        );
    }

    // --- MODE 2: EDITOR POSTER PROMO ---
    if (id && !itemKritis) return <div className="flex justify-center items-center h-screen">Bahan tidak ditemukan</div>;

    return (
        <div className="flex flex-col min-h-full w-full max-w-md mx-auto relative overflow-x-hidden pb-24 px-4 pt-6">
            <PromoPoster ref={posterRef} itemKritis={itemKritis} diskon={diskon} />
            <div className="flex items-center gap-4 mb-6 mt-4">
                <button onClick={handleBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"><ArrowLeft size={20} className="text-gray-700" /></button>
                <h2 className="text-2xl font-bold text-gray-800">Tindakan Cepat</h2>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="flex justify-between mb-4"><div><span className="px-3 py-1 text-xs font-bold rounded-full mb-2 inline-block bg-orange-100 text-orange-600">{itemKritis.sisaWaktu}</span><h3 className="text-xl font-bold text-gray-800">{itemKritis.nama}</h3><p className="text-gray-500 text-sm mt-1">Sisa Stok: <span className="font-bold text-gray-700">{itemKritis.sisa}</span></p></div></div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
                <label className="block text-gray-700 font-bold mb-4 flex items-center gap-2"><Tag size={18} /> Atur Besaran Diskon</label>
                <div className="flex items-center gap-4 mb-8">
                    <input type="range" min="10" max="70" step="5" value={diskon} disabled={isSuccess} onChange={(e) => setDiskon(e.target.value)} className="w-full h-2 rounded-lg bg-gray-200 accent-[#1A361D]" />
                    <span className="text-2xl font-bold text-[#1A361D] w-16 text-center">{diskon}%</span>
                </div>

                {!isSuccess ? (
                    <button onClick={handleTerapkan} className="w-full py-4 bg-[#1A361D] text-white rounded-xl font-bold">Terapkan Flash Sale!</button>
                ) : (
                    <div className="space-y-3 animate-fade-in">
                        <div className="w-full py-3 bg-green-50 text-green-700 border border-green-200 rounded-xl font-bold flex justify-center items-center gap-2"><CheckCircle2 size={20} /> Promo Aktif!</div>
                        <button onClick={handleDownloadPoster} disabled={isDownloading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex justify-center items-center gap-2"><ImageIcon size={20} /> Unduh Poster Promo</button>

                        {/* TOMBOL KEMBALI DINAMIS */}
                        <button onClick={handleBack} className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl flex justify-center items-center gap-2">
                            Kembali ke {fromWhere === 'briefing' ? 'Layar Briefing' : 'Daftar Promo'}
                        </button>
                    </div>
                )}
            </div>
            <ToastNotification isVisible={isSuccess} message="Sinkronisasi ke kasir berhasil..." />
        </div>
    );
};

export default EksekusiPromo;