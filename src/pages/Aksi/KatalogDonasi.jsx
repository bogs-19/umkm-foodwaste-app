import React, { useState, useEffect } from 'react';
import { ArrowLeft, HeartHandshake, CheckCircle2, Plus, X, AlertCircle, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { dummyInventory } from '../../data/dummyInventory';
import { ToastNotification } from '../../components/Modals/ToastNotification'; // Import Toast Notification

const KatalogDonasi = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const fromWhere = queryParams.get('from');

    const [globalInventory, setGlobalInventory] = useState([]);
    const [riwayatDonasi, setRiwayatDonasi] = useState([]);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ idBahan: '', jumlah: '', target: '' });

    // State untuk Custom Alert Box Hapus Donasi
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [idDonasiToDelete, setIdDonasiToDelete] = useState(null);

    // STATE BARU: Untuk menggantikan window.alert bawaan browser
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

        // VALIDASI 1: Cek Kolom Kosong
        if (!formData.idBahan || !formData.jumlah || !formData.target.trim()) {
            return setErrorMsg("Harap lengkapi semua data formulir donasi terlebih dahulu!");
        }
        if (!selectedBahanDetail) return;

        const sisaStokTersedia = parseFloat(selectedBahanDetail.sisa);
        const satuanBahan = selectedBahanDetail.sisa.replace(/[0-9.]/g, '').trim();
        const jumlahDonasi = parseFloat(formData.jumlah);

        // VALIDASI 2: Cek Limit Stok
        if (jumlahDonasi <= 0 || jumlahDonasi > sisaStokTersedia) {
            return setErrorMsg(`Jumlah donasi tidak valid! Anda mencoba mendonasikan ${jumlahDonasi} ${satuanBahan}, sementara sisa stok saat ini hanya ${selectedBahanDetail.sisa}.`);
        }

        const sisaAkhir = sisaStokTersedia - jumlahDonasi;
        const updatedInventory = sisaAkhir <= 0
            ? globalInventory.filter(item => item.id !== selectedBahanDetail.id)
            : globalInventory.map(item => item.id === selectedBahanDetail.id ? { ...item, sisa: `${sisaAkhir} ${satuanBahan}` } : item);

        setGlobalInventory(updatedInventory);
        localStorage.setItem('umkm_inventory', JSON.stringify(updatedInventory));

        // Bersihkan item dari keranjang briefing disisihkan
        const savedDisisihkan = JSON.parse(localStorage.getItem('umkm_disisihkan') || '[]');
        const updatedDisisihkan = savedDisisihkan.filter(i => i.id !== selectedBahanDetail.id);
        localStorage.setItem('umkm_disisihkan', JSON.stringify(updatedDisisihkan));

        const today = new Date();
        const formattedDate = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

        const donasiBaru = {
            id: Date.now(),
            bahan: `${jumlahDonasi} ${satuanBahan} ${selectedBahanDetail.nama}`,
            target: formData.target,
            status: "Terkirim",
            tanggal: formattedDate
        };

        const updateDaftarDonasi = [donasiBaru, ...riwayatDonasi];
        setRiwayatDonasi(updateDaftarDonasi);
        localStorage.setItem('umkm_donasi', JSON.stringify(updateDaftarDonasi));

        setIsFormOpen(false);
        setFormData({ idBahan: '', jumlah: '', target: '' });

        // TRIGGER TOAST SUCCESS CUSTOM
        setSuccessMsg(`Data Donasi ${selectedBahanDetail.nama} berhasil dicatat.`);
        setIsSuccess(true);

        // Jeda waktu 2 detik agar animasi pop-up sukses terlihat sebelum pindah halaman
        setTimeout(() => {
            setIsSuccess(false);
            if (fromWhere === 'briefing') navigate('/briefing', { replace: true });
            else navigate('/donasi', { replace: true });
        }, 2000);
    };

    // TRIGGER MODAL CUSTOM
    const triggerDeleteDonasi = (id) => {
        setIdDonasiToDelete(id);
        setIsConfirmModalOpen(true);
    };

    // EKSEKUSI HAPUS
    const executeDeleteDonasi = () => {
        const riwayatBaru = riwayatDonasi.filter((item) => item.id !== idDonasiToDelete);
        setRiwayatDonasi(riwayatBaru);
        localStorage.setItem('umkm_donasi', JSON.stringify(riwayatBaru));

        setIsConfirmModalOpen(false);
        setIdDonasiToDelete(null);
    };

    return (
        <div className="flex flex-col min-h-full w-full max-w-md mx-auto pb-6 relative px-4 pt-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={handleBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"><ArrowLeft size={20} className="text-gray-700" /></button>
                <h2 className="text-2xl font-bold text-gray-800">Katalog Donasi</h2>
            </div>

            <button onClick={() => setIsFormOpen(true)} className="w-full mb-6 py-4 bg-[#A7D189] text-[#1A361D] rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#95C276] shadow-md"><Plus size={20} /> Tambah Donasi Manual</button>

            <div className="space-y-4">
                {riwayatDonasi.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group animate-fade-in">
                        <div><h3 className="font-bold text-gray-800">{item.bahan}</h3><p className="text-xs text-gray-500 mt-1">Kepada: {item.target}</p><p className="text-[10px] text-gray-400 mt-1">{item.tanggal}</p></div>
                        <div className="flex items-center gap-3 pl-3 border-l"><CheckCircle2 size={24} className="text-green-500" /><button onClick={() => triggerDeleteDonasi(item.id)} className="text-gray-300 hover:text-red-500 p-1 rounded transition-colors"><Trash2 size={18} /></button></div>
                    </div>
                ))}
            </div>

            {/* FORM MODAL RECORD DONASI */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"><div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"><div className="flex items-center justify-between p-4 bg-gray-50"><h3 className="font-bold text-gray-800 flex items-center gap-2"><HeartHandshake size={18} className="text-[#A7D189]" /> Catat Donasi Baru</h3><button onClick={() => setIsFormOpen(false)}><X size={20} className="text-gray-400" /></button></div><form onSubmit={handleSubmitDonasi} className="p-5 space-y-4"><div><label className="block text-xs font-bold text-gray-500 mb-1">PILIH BAHAN</label><select required value={formData.idBahan} onChange={(e) => setFormData({ ...formData, idBahan: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl"><option value="" disabled>-- Pilih Bahan --</option>{globalInventory.map(item => <option key={item.id} value={item.id}>{item.nama} (Stok: {item.sisa})</option>)}</select></div><div><label className="block text-xs font-bold text-gray-500">JUMLAH (Maks: {selectedBahanDetail?.sisa || 0})</label><input type="number" step="0.1" required value={formData.jumlah} onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl" /></div><div><label className="block text-xs font-bold text-gray-500 mb-1">MITRA PENERIMA</label><input type="text" required value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl" /></div><button type="submit" className="w-full py-3 bg-[#1A361D] text-white rounded-xl font-bold flex justify-center items-center gap-2">Simpan Donasi</button></form></div></div>
            )}

            {/* CUSTOM ALERT BOX: ERROR VALIDASI */}
            {errorMsg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center animate-slide-down">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-xl mb-2">Peringatan</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            {errorMsg}
                        </p>
                        <button onClick={() => setErrorMsg('')} className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* CUSTOM ALERT BOX: KONFIRMASI HAPUS RIWAYAT DONASI */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center animate-slide-down">
                        <div className="w-14 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-xl mb-2">Hapus Riwayat Donasi?</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            Data catatan ini akan dihapus dari riwayat donasi sistem secara permanen.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => { setIsConfirmModalOpen(false); setIdDonasiToDelete(null); }} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">Batal</button>
                            <button onClick={executeDeleteDonasi} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md">Ya, Hapus</button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST SUCCESS NOTIFICATION */}
            <ToastNotification isVisible={isSuccess} message={successMsg} />
        </div>
    );
};

export default KatalogDonasi;