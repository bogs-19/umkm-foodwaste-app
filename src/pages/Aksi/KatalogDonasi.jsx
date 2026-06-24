import React, { useState, useEffect } from 'react';
import { ArrowLeft, HeartHandshake, CheckCircle2, Plus, X, AlertCircle, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { dummyInventory } from '../../data/dummyInventory';
import { ToastNotification } from '../../components/Modals/ToastNotification';

const KatalogDonasi = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const fromWhere = queryParams.get('from');

    const [globalInventory, setGlobalInventory] = useState([]);
    const [riwayatDonasi, setRiwayatDonasi] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ idBahan: '', jumlah: '', target: '' });
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [idDonasiToDelete, setIdDonasiToDelete] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleBack = () => {
        if (fromWhere === 'briefing') navigate('/briefing');
        else navigate('/dashboard');
    };

    useEffect(() => {
        const savedInventory = localStorage.getItem('umkm_inventory');
        setGlobalInventory(savedInventory ? JSON.parse(savedInventory) : dummyInventory);

        const savedDonasi = localStorage.getItem('umkm_donasi');
        if (savedDonasi) {
            setRiwayatDonasi(JSON.parse(savedDonasi));
        } else {
            const defaultDonasi = [{ id: 1, bahan: "2 kg Sisa Nasi & Sayur", target: "Peternakan Lele Pak Budi", status: "Terkirim", tanggal: "23 Juni 2026" }];
            setRiwayatDonasi(defaultDonasi);
            localStorage.setItem('umkm_donasi', JSON.stringify(defaultDonasi));
        }

        const itemIdFromUrl = queryParams.get('itemId');
        if (itemIdFromUrl) {
            setIsFormOpen(true);
            setFormData(prev => ({ ...prev, idBahan: itemIdFromUrl }));
        }
    }, [location.search]);

    const selectedBahanDetail = globalInventory.find(item => item.id.toString() === formData.idBahan);

    const handleSubmitDonasi = (e) => {
        e.preventDefault();
        if (!formData.idBahan || !formData.jumlah || !formData.target.trim()) {
            return setErrorMsg("Harap lengkapi semua data formulir donasi terlebih dahulu!");
        }
        if (!selectedBahanDetail) return;

        const sisaStokTersedia = parseFloat(selectedBahanDetail.sisa);
        const satuanBahan = selectedBahanDetail.sisa.replace(/[0-9.]/g, '').trim();
        const jumlahDonasi = parseFloat(formData.jumlah);

        if (jumlahDonasi <= 0 || jumlahDonasi > sisaStokTersedia) {
            return setErrorMsg(`Jumlah donasi tidak valid! Sisa stok saat ini hanya ${selectedBahanDetail.sisa}.`);
        }

        const sisaAkhir = sisaStokTersedia - jumlahDonasi;
        const updatedInventory = sisaAkhir <= 0
            ? globalInventory.filter(item => item.id !== selectedBahanDetail.id)
            : globalInventory.map(item => item.id === selectedBahanDetail.id ? { ...item, sisa: `${sisaAkhir} ${satuanBahan}` } : item);

        setGlobalInventory(updatedInventory);
        localStorage.setItem('umkm_inventory', JSON.stringify(updatedInventory));

        const savedDisisihkan = JSON.parse(localStorage.getItem('umkm_disisihkan') || '[]');
        const updatedDisisihkan = savedDisisihkan.filter(i => i.id !== selectedBahanDetail.id);
        localStorage.setItem('umkm_disisihkan', JSON.stringify(updatedDisisihkan));

        const today = new Date();
        const donasiBaru = {
            id: Date.now(),
            bahan: `${jumlahDonasi} ${satuanBahan} ${selectedBahanDetail.nama}`,
            target: formData.target,
            status: "Terkirim",
            tanggal: today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        };

        const updateDaftarDonasi = [donasiBaru, ...riwayatDonasi];
        setRiwayatDonasi(updateDaftarDonasi);
        localStorage.setItem('umkm_donasi', JSON.stringify(updateDaftarDonasi));

        setIsFormOpen(false);
        setFormData({ idBahan: '', jumlah: '', target: '' });
        setSuccessMsg(`Donasi ${selectedBahanDetail.nama} berhasil dicatat.`);
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            if (fromWhere === 'briefing') navigate('/briefing', { replace: true });
            else navigate('/donasi', { replace: true });
        }, 2000);
    };

    const triggerDeleteDonasi = (id) => { setIdDonasiToDelete(id); setIsConfirmModalOpen(true); };
    const executeDeleteDonasi = () => {
        const riwayatBaru = riwayatDonasi.filter((item) => item.id !== idDonasiToDelete);
        setRiwayatDonasi(riwayatBaru);
        localStorage.setItem('umkm_donasi', JSON.stringify(riwayatBaru));
        setIsConfirmModalOpen(false); setIdDonasiToDelete(null);
    };

    return (
        <div className="flex flex-col min-h-full w-full max-w-md mx-auto pb-24 relative px-4 pt-6 text-white font-sans">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={handleBack} className="p-2 bg-[#1C1C24] border border-white/5 rounded-full hover:bg-white/10 transition-colors"><ArrowLeft size={20} className="text-gray-300" /></button>
                <h2 className="text-2xl font-black tracking-wide text-white">Katalog Donasi</h2>
            </div>

            <button onClick={() => setIsFormOpen(true)} className="w-full mb-8 py-4.5 bg-[#A7D189] text-[#13131A] rounded-[20px] font-black flex justify-center items-center gap-2 hover:bg-[#95C276] shadow-[0_10px_20px_rgba(167,209,137,0.2)] active:scale-95 transition-all"><Plus size={22} className="stroke-[3px]" /> Tambah Donasi Manual</button>

            <div className="space-y-4">
                {riwayatDonasi.map((item) => (
                    <div key={item.id} className="bg-[#1C1C24] p-5 rounded-[24px] shadow-lg border border-white/5 flex justify-between items-center group animate-fade-in hover:-translate-y-1 transition-transform duration-300">
                        <div><h3 className="font-bold text-white text-base">{item.bahan}</h3><p className="text-sm text-gray-400 mt-1 font-medium">Kepada: <span className="text-[#A7D189]">{item.target}</span></p><p className="text-[10px] text-gray-500 mt-2 font-bold tracking-widest uppercase">{item.tanggal}</p></div>
                        <div className="flex items-center gap-4 pl-4 border-l border-white/10"><CheckCircle2 size={28} className="text-[#A7D189]" /><button onClick={() => triggerDeleteDonasi(item.id)} className="text-gray-500 hover:text-red-400 p-2 bg-[#252530] hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18} /></button></div>
                    </div>
                ))}
            </div>

            {/* FORM MODAL RECORD DONASI */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1528]/80 backdrop-blur-md">
                    <div className="bg-[#1C1C24] w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden border border-white/10">
                        <div className="flex items-center justify-between p-6 border-b border-white/5"><h3 className="font-black text-white flex items-center gap-2"><HeartHandshake size={20} className="text-[#A7D189]" /> Catat Donasi</h3><button onClick={() => setIsFormOpen(false)}><X size={22} className="text-gray-500 hover:text-white transition-colors" /></button></div>
                        <form onSubmit={handleSubmitDonasi} className="p-6 space-y-6">
                            <div><label className="block text-[10px] font-bold text-gray-400 mb-2 tracking-widest uppercase">Pilih Bahan</label><select required value={formData.idBahan} onChange={(e) => setFormData({ ...formData, idBahan: e.target.value })} className="w-full px-4 py-4 bg-[#252530] border border-white/5 text-white rounded-2xl text-sm outline-none focus:ring-1 focus:ring-[#A7D189]"><option value="" disabled>-- Pilih Bahan --</option>{globalInventory.map(item => <option key={item.id} value={item.id}>{item.nama} (Stok: {item.sisa})</option>)}</select></div>
                            <div><label className="block text-[10px] font-bold text-gray-400 mb-2 tracking-widest uppercase">Jumlah (Maks: {selectedBahanDetail?.sisa || 0})</label><input type="number" step="0.1" required value={formData.jumlah} onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })} className="w-full px-5 py-4 bg-[#252530] border border-white/5 text-white rounded-2xl text-sm outline-none focus:ring-1 focus:ring-[#A7D189]" placeholder="0.0" /></div>
                            <div><label className="block text-[10px] font-bold text-gray-400 mb-2 tracking-widest uppercase">Mitra Penerima</label><input type="text" required value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} className="w-full px-5 py-4 bg-[#252530] border border-white/5 text-white rounded-2xl text-sm outline-none focus:ring-1 focus:ring-[#A7D189]" placeholder="Nama Lembaga/Panti" /></div>
                            <button type="submit" className="w-full mt-2 py-4 bg-[#A7D189] text-[#13131A] rounded-2xl font-black flex justify-center items-center gap-2 hover:bg-[#95C276] shadow-lg shadow-[#A7D189]/20 transition-all">Simpan Donasi</button>
                        </form>
                    </div>
                </div>
            )}

            {/* CUSTOM ALERT BOX ERROR */}
            {errorMsg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1528]/80 backdrop-blur-md animate-fade-in"><div className="bg-[#1C1C24] w-full max-w-sm rounded-[32px] shadow-2xl p-8 text-center border border-white/10"><div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-[20px] flex items-center justify-center mx-auto mb-5 border border-red-500/20"><AlertTriangle size={32} /></div><h3 className="font-black text-white text-xl mb-2">Peringatan</h3><p className="text-gray-400 text-sm mb-8 font-medium">{errorMsg}</p><button onClick={() => setErrorMsg('')} className="w-full py-4 bg-[#252530] text-gray-300 rounded-2xl font-bold hover:bg-white/10 transition-colors">Tutup</button></div></div>
            )}

            {/* CUSTOM ALERT BOX HAPUS */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1528]/80 backdrop-blur-md animate-fade-in"><div className="bg-[#1C1C24] w-full max-w-sm rounded-[32px] shadow-2xl p-8 text-center border border-white/10"><div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-[20px] flex items-center justify-center mx-auto mb-5 border border-red-500/20"><AlertTriangle size={32} /></div><h3 className="font-black text-white text-xl mb-2">Hapus Riwayat?</h3><p className="text-gray-400 text-sm mb-8 font-medium">Data catatan ini akan dihapus dari riwayat sistem secara permanen.</p><div className="flex gap-3"><button onClick={() => { setIsConfirmModalOpen(false); setIdDonasiToDelete(null); }} className="flex-1 py-4 bg-[#252530] text-gray-300 rounded-2xl font-bold hover:bg-white/10 transition-colors">Batal</button><button onClick={executeDeleteDonasi} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">Ya, Hapus</button></div></div></div>
            )}

            <ToastNotification isVisible={isSuccess} message={successMsg} />
        </div>
    );
};

export default KatalogDonasi;