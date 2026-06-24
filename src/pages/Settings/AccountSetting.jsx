import React, { useState, useEffect } from 'react';
// 👇 KUNCI PERBAIKAN: CheckCircle2 sudah ditambahkan di baris import ini
import { ArrowLeft, User, Shield, LogOut, ChevronRight, Check, X, Key, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastNotification } from '../../components/Modals/ToastNotification';

const AccountSetting = () => {
    const navigate = useNavigate();

    // ==========================================
    // 1. STATE MANAGEMENT (DATA & INTERAKSI)
    // ==========================================
    const [activeSubPanel, setActiveSubPanel] = useState('none');

    // --- State 1: Profil ---
    const [user, setUser] = useState({ name: 'Memuat...', email: '...' });
    const [isEditingCard, setIsEditingCard] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: '', email: '' });

    // --- State 2: Keamanan / Password ---
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // --- State 3: Custom UI Feedback (Menggantikan alert bawaan) ---
    const [toast, setToast] = useState({ isVisible: false, message: '' });
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    // ==========================================
    // 2. EFEK AWAL (LOAD DATA DARI MEMORI)
    // ==========================================
    useEffect(() => {
        // Load Profil
        const savedUser = localStorage.getItem('umkm_user');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            setUser(parsed);
            setProfileForm({ name: parsed.name, email: parsed.email });
        } else {
            const defaultUser = { name: 'Bagus Radhit Pratama', email: 'baguspratama5000@gmail.com' };
            setUser(defaultUser);
            setProfileForm(defaultUser);
        }

        // Setup default password untuk simulasi jika belum ada
        if (!localStorage.getItem('umkm_password')) {
            localStorage.setItem('umkm_password', 'admin123');
        }
    }, []);

    // Helper Fungsi untuk memunculkan Toast Success
    const showToastSuccess = (msg) => {
        setToast({ isVisible: true, message: msg });
        setTimeout(() => setToast({ isVisible: false, message: '' }), 2500);
    };

    // ==========================================
    // 3. FUNGSI LOGIKA AKSI (SAVE HANDLERS)
    // ==========================================

    // Handler 1: Simpan Profil ke Database
    const handleSaveCardProfile = async () => {
        try {
            const updatedUser = { name: profileForm.name, email: profileForm.email };

            setUser(updatedUser);
            localStorage.setItem('umkm_user', JSON.stringify(updatedUser));
            setIsEditingCard(false);

            showToastSuccess("Profil berhasil diperbarui!");
        } catch (error) {
            setErrorModal({ isOpen: true, message: error.message || "Gagal memperbarui profil." });
        }
    };

    // Handler 2: Update Password
    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setErrorModal({ isOpen: true, message: "Konfirmasi kata sandi baru tidak cocok! Silakan periksa kembali ketikan Anda." });
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setErrorModal({ isOpen: true, message: "Kata sandi baru minimal harus 6 karakter untuk keamanan." });
            return;
        }

        try {
            // Simulasi ganti password di localstorage
            localStorage.setItem('umkm_password', passwordForm.newPassword);

            showToastSuccess("Kata sandi berhasil diperbarui!");
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setActiveSubPanel('none');
        } catch (error) {
            setErrorModal({ isOpen: true, message: error.message || "Terjadi kesalahan saat mengganti kata sandi." });
        }
    };

    // Handler 3: Eksekusi Keluar (Logout)
    const executeLogout = () => {
        localStorage.removeItem('umkm_token'); // Hapus token auth
        localStorage.removeItem('umkm_user');  // Hapus data info user (nama, email)
        localStorage.removeItem('umkm_disisihkan'); // Opsional: Bersihkan cache briefing jika diperlukan
        localStorage.removeItem('umkm_briefing_queue'); // Opsional: Bersihkan sisa antrean kartu

        navigate('/'); // Tendang kembali ke halaman Login awal
    };

    return (
        <div className="flex flex-col min-h-full w-full max-w-md mx-auto pb-24 relative overflow-x-hidden px-4 pt-6">

            {/* Header Utama */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Pengaturan Akun</h2>
            </div>

            {/* 1. KARTU PROFIL UTAMA */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-[#1A361D] shrink-0">
                    <User size={32} />
                </div>

                <div className="flex-1 overflow-hidden">
                    {isEditingCard ? (
                        <div className="space-y-3 animate-fade-in">
                            <input
                                type="text"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] outline-none px-3 py-2 text-sm font-bold text-gray-800 bg-gray-50 transition-all"
                                placeholder="Nama Lengkap"
                            />
                            <input
                                type="email"
                                value={profileForm.email}
                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] outline-none px-3 py-2 text-sm text-gray-600 bg-gray-50 transition-all"
                                placeholder="Alamat Email"
                            />
                            <div className="flex gap-2 mt-2">
                                <button onClick={handleSaveCardProfile} className="flex-1 bg-[#10B981] text-white py-2 rounded-xl flex justify-center items-center gap-1 font-bold text-xs shadow-sm hover:bg-[#059669] transition-colors active:scale-95">
                                    <Check size={14} /> Simpan
                                </button>
                                <button onClick={() => setIsEditingCard(false)} className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl flex justify-center items-center gap-1 font-bold text-xs hover:bg-red-100 transition-colors active:scale-95">
                                    <X size={14} /> Batal
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <h3 className="text-xl font-bold text-gray-800 truncate">{user.name}</h3>
                            <p className="text-sm text-gray-500 mb-2 truncate">{user.email}</p>
                            <span className="px-2 py-0.5 bg-[#1A361D] text-white text-[10px] font-bold rounded tracking-wider uppercase">Manajer UMKM</span>
                        </div>
                    )}
                </div>
            </div>

            {/* LIST MENU PENGATURAN UTAMA */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <button
                    onClick={() => { setIsEditingCard(true); setActiveSubPanel('none'); }}
                    className={`w-full flex items-center justify-between p-5 border-b border-gray-50 transition-colors ${isEditingCard ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}
                >
                    <div className="flex items-center gap-4 text-gray-700">
                        <User size={20} className="text-[#A7D189]" />
                        <span className="font-semibold text-sm">Edit Profil Akun</span>
                    </div>
                    <ChevronRight size={18} className={`text-gray-400 transition-transform ${isEditingCard ? 'rotate-90' : ''}`} />
                </button>

                <button
                    onClick={() => { setActiveSubPanel(activeSubPanel === 'keamanan' ? 'none' : 'keamanan'); setIsEditingCard(false); }}
                    className={`w-full flex items-center justify-between p-5 transition-colors ${activeSubPanel === 'keamanan' ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}
                >
                    <div className="flex items-center gap-4 text-gray-700">
                        <Shield size={20} className="text-[#A7D189]" />
                        <span className="font-semibold text-sm">Keamanan & Password</span>
                    </div>
                    <ChevronRight size={18} className={`text-gray-400 transition-transform ${activeSubPanel === 'keamanan' ? 'rotate-90' : ''}`} />
                </button>
            </div>

            {/* PANEL CONFIG: KEAMANAN & PASSWORD */}
            {activeSubPanel === 'keamanan' && (
                <form onSubmit={handleUpdatePassword} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 animate-slide-down space-y-5">
                    <div>
                        <h4 className="font-bold text-gray-800 text-base mb-1 flex items-center gap-2">
                            <Key size={18} className="text-[#A7D189]" /> Perbarui Kata Sandi
                        </h4>
                        <p className="text-xs text-gray-400">Amankan akun manajer Anda secara berkala.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">KATA SANDI LAMA</label>
                            <input
                                type="password" required
                                value={passwordForm.oldPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A7D189] transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">KATA SANDI BARU</label>
                            <input
                                type="password" required
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A7D189] transition-all"
                                placeholder="Minimal 6 karakter"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">ULANGI KATA SANDI BARU</label>
                            <input
                                type="password" required
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A7D189] transition-all"
                                placeholder="Ulangi kata sandi baru"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-3.5 bg-[#1A361D] hover:bg-[#122614] text-white font-bold rounded-xl text-sm transition-colors flex justify-center items-center gap-2 shadow-md active:scale-95">
                        <CheckCircle2 size={18} /> Simpan Kata Sandi
                    </button>
                </form>
            )}

            {/* Tombol Keluar Utama -> Memicu Modal */}
            <button
                onClick={() => setLogoutModalOpen(true)}
                className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-red-100 transition-colors shadow-sm mt-auto"
            >
                <LogOut size={20} /> Keluar dari Akun
            </button>


            {/* ========================================================================= */}
            {/* KUMPULAN CUSTOM MODAL UI FEEDBACK */}
            {/* ========================================================================= */}

            {/* 1. CUSTOM ERROR MODAL */}
            {errorModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center animate-slide-down">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="font-bold text-gray-800 text-xl mb-2">Peringatan</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            {errorModal.message}
                        </p>
                        <button onClick={() => setErrorModal({ isOpen: false, message: '' })} className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                            Mengerti
                        </button>
                    </div>
                </div>
            )}

            {/* 2. CUSTOM LOGOUT CONFIRMATION MODAL */}
            {logoutModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center animate-slide-down relative">
                        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut size={32} className="ml-1" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-xl mb-2">Keluar Sesi?</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            Anda harus masuk kembali menggunakan email dan kata sandi Anda nanti.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setLogoutModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                                Batal
                            </button>
                            <button onClick={executeLogout} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md">
                                Ya, Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. TOAST NOTIFICATION SUCCESS */}
            <ToastNotification isVisible={toast.isVisible} message={toast.message} />

        </div>
    );
};

export default AccountSetting;