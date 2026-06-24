import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Shield, LogOut, ChevronRight, Check, X, Key, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastNotification } from '../../components/Modals/ToastNotification';

const AccountSetting = () => {
    const navigate = useNavigate();

    // 1. STATE MANAGEMENT (Tetap sama)
    const [activeSubPanel, setActiveSubPanel] = useState('none');
    const [user, setUser] = useState({ name: 'Memuat...', email: '...' });
    const [isEditingCard, setIsEditingCard] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: '', email: '' });
    const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [toast, setToast] = useState({ isVisible: false, message: '' });
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    // 2. EFEK AWAL (Tetap sama)
    useEffect(() => {
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

        if (!localStorage.getItem('umkm_password')) {
            localStorage.setItem('umkm_password', 'admin123');
        }
    }, []);

    const showToastSuccess = (msg) => {
        setToast({ isVisible: true, message: msg });
        setTimeout(() => setToast({ isVisible: false, message: '' }), 2500);
    };

    // 3. FUNGSI LOGIKA (Tetap sama)
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

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setErrorModal({ isOpen: true, message: "Konfirmasi kata sandi baru tidak cocok!" });
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setErrorModal({ isOpen: true, message: "Kata sandi baru minimal harus 6 karakter." });
            return;
        }
        try {
            localStorage.setItem('umkm_password', passwordForm.newPassword);
            showToastSuccess("Kata sandi berhasil diperbarui!");
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setActiveSubPanel('none');
        } catch (error) {
            setErrorModal({ isOpen: true, message: error.message || "Terjadi kesalahan." });
        }
    };

    const executeLogout = () => {
        localStorage.removeItem('umkm_token');
        localStorage.removeItem('umkm_user');
        localStorage.removeItem('umkm_disisihkan');
        localStorage.removeItem('umkm_briefing_queue');
        navigate('/');
    };

    return (
        // 👇 Wrapper utama transparan (karena warna ditarik dari MainLayout)
        <div className="flex flex-col min-h-full w-full max-w-md mx-auto pb-24 relative overflow-x-hidden px-4 pt-6 text-white">

            {/* Header Utama */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 bg-[#1C1C24] border border-white/5 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft size={20} className="text-gray-300" />
                </button>
                <h2 className="text-2xl font-black tracking-wide text-white">Pengaturan Akun</h2>
            </div>

            {/* 1. KARTU PROFIL UTAMA (DARK MODE) */}
            <div className="bg-[#1C1C24] p-6 rounded-[28px] shadow-lg border border-white/5 flex items-center gap-5 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#A7D189]/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="w-16 h-16 bg-[#A7D189]/10 border border-[#A7D189]/20 rounded-[20px] flex items-center justify-center text-[#A7D189] shrink-0 relative z-10">
                    <User size={32} />
                </div>

                <div className="flex-1 overflow-hidden relative z-10">
                    {isEditingCard ? (
                        <div className="space-y-3 animate-fade-in">
                            <input
                                type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                className="w-full bg-[#13131A] border border-white/10 rounded-xl focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] outline-none px-4 py-3 text-sm font-bold text-white transition-all placeholder-gray-500"
                                placeholder="Nama Lengkap"
                            />
                            <input
                                type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                className="w-full bg-[#13131A] border border-white/10 rounded-xl focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] outline-none px-4 py-3 text-sm text-gray-300 transition-all placeholder-gray-500"
                                placeholder="Alamat Email"
                            />
                            <div className="flex gap-2 mt-3">
                                <button onClick={handleSaveCardProfile} className="flex-1 bg-[#A7D189] text-[#13131A] py-2.5 rounded-xl flex justify-center items-center gap-1 font-black text-xs hover:bg-[#95C276] transition-colors shadow-lg shadow-[#A7D189]/20">
                                    <Check size={16} /> Simpan
                                </button>
                                <button onClick={() => setIsEditingCard(false)} className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 py-2.5 rounded-xl flex justify-center items-center gap-1 font-bold text-xs hover:bg-red-500/20 transition-colors">
                                    <X size={16} /> Batal
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <h3 className="text-xl font-black text-white truncate">{user.name}</h3>
                            <p className="text-sm text-gray-400 mb-3 truncate font-medium">{user.email}</p>
                            <span className="px-3 py-1 bg-[#A7D189]/10 border border-[#A7D189]/30 text-[#A7D189] text-[10px] font-bold rounded-lg tracking-widest uppercase">Manajer UMKM</span>
                        </div>
                    )}
                </div>
            </div>

            {/* LIST MENU PENGATURAN UTAMA (DARK MODE) */}
            <div className="bg-[#1C1C24] rounded-[28px] shadow-lg border border-white/5 overflow-hidden mb-6">
                <button
                    onClick={() => { setIsEditingCard(true); setActiveSubPanel('none'); }}
                    className={`w-full flex items-center justify-between p-5 border-b border-white/5 transition-colors ${isEditingCard ? 'bg-white/5' : 'hover:bg-[#252530]'}`}
                >
                    <div className="flex items-center gap-4 text-gray-300">
                        <div className="p-2 bg-[#252530] rounded-xl text-[#A7D189]"><User size={18} /></div>
                        <span className="font-semibold text-sm tracking-wide">Edit Profil Akun</span>
                    </div>
                    <ChevronRight size={18} className={`text-gray-500 transition-transform ${isEditingCard ? 'rotate-90' : ''}`} />
                </button>

                <button
                    onClick={() => { setActiveSubPanel(activeSubPanel === 'keamanan' ? 'none' : 'keamanan'); setIsEditingCard(false); }}
                    className={`w-full flex items-center justify-between p-5 transition-colors ${activeSubPanel === 'keamanan' ? 'bg-white/5' : 'hover:bg-[#252530]'}`}
                >
                    <div className="flex items-center gap-4 text-gray-300">
                        <div className="p-2 bg-[#252530] rounded-xl text-[#A7D189]"><Shield size={18} /></div>
                        <span className="font-semibold text-sm tracking-wide">Keamanan & Password</span>
                    </div>
                    <ChevronRight size={18} className={`text-gray-500 transition-transform ${activeSubPanel === 'keamanan' ? 'rotate-90' : ''}`} />
                </button>
            </div>

            {/* PANEL CONFIG: KEAMANAN & PASSWORD (DARK MODE) */}
            {activeSubPanel === 'keamanan' && (
                <form onSubmit={handleUpdatePassword} className="bg-[#1C1C24] p-6 rounded-[28px] shadow-lg border border-white/5 mb-6 animate-slide-down space-y-6">
                    <div>
                        <h4 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                            <Key size={18} className="text-[#A7D189]" /> Perbarui Kata Sandi
                        </h4>
                        <p className="text-xs text-gray-400">Amankan akun manajer Anda secara berkala.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-2 tracking-widest uppercase">Kata Sandi Lama</label>
                            <input
                                type="password" required value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                className="w-full px-5 py-4 bg-[#13131A] border border-white/5 rounded-2xl text-sm text-white focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all placeholder-gray-600" placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-2 tracking-widest uppercase">Kata Sandi Baru</label>
                            <input
                                type="password" required value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                className="w-full px-5 py-4 bg-[#13131A] border border-white/5 rounded-2xl text-sm text-white focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all placeholder-gray-600" placeholder="Minimal 6 karakter"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-2 tracking-widest uppercase">Ulangi Sandi Baru</label>
                            <input
                                type="password" required value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                className="w-full px-5 py-4 bg-[#13131A] border border-white/5 rounded-2xl text-sm text-white focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all placeholder-gray-600" placeholder="Ulangi kata sandi baru"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-[#A7D189] hover:bg-[#95C276] text-[#13131A] font-black rounded-2xl text-sm transition-all flex justify-center items-center gap-2 shadow-lg shadow-[#A7D189]/20 active:scale-95">
                        <CheckCircle2 size={18} /> Simpan Kata Sandi
                    </button>
                </form>
            )}

            {/* Tombol Keluar Utama -> Memicu Modal (Dark Mode) */}
            <button
                onClick={() => setLogoutModalOpen(true)}
                className="w-full py-4.5 bg-[#252530] border border-red-500/20 text-red-400 rounded-[20px] font-bold flex justify-center items-center gap-2 hover:bg-red-500/10 hover:border-red-500/40 transition-all mt-auto mb-4"
            >
                <LogOut size={20} /> Keluar dari Akun
            </button>


            {/* ========================================================================= */}
            {/* KUMPULAN CUSTOM MODAL UI FEEDBACK (DARK MODE) */}
            {/* ========================================================================= */}

            {/* 1. CUSTOM ERROR MODAL */}
            {errorModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1528]/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#1C1C24] border border-white/10 w-full max-w-sm rounded-[32px] shadow-2xl p-8 text-center animate-slide-down">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[20px] flex items-center justify-center mx-auto mb-5">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="font-black text-white text-xl mb-2">Peringatan</h3>
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">
                            {errorModal.message}
                        </p>
                        <button onClick={() => setErrorModal({ isOpen: false, message: '' })} className="w-full py-4 bg-[#252530] hover:bg-[#30303b] text-white rounded-2xl font-bold transition-colors">
                            Mengerti
                        </button>
                    </div>
                </div>
            )}

            {/* 2. CUSTOM LOGOUT CONFIRMATION MODAL */}
            {logoutModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1528]/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#1C1C24] border border-white/10 w-full max-w-sm rounded-[32px] shadow-2xl p-8 text-center animate-slide-down relative">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[20px] flex items-center justify-center mx-auto mb-5">
                            <LogOut size={32} className="ml-1" />
                        </div>
                        <h3 className="font-black text-white text-xl mb-2">Keluar Sesi?</h3>
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">
                            Anda harus masuk kembali menggunakan email dan kata sandi Anda nanti.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setLogoutModalOpen(false)} className="flex-1 py-4 bg-[#252530] text-gray-300 rounded-2xl font-bold hover:bg-white/10 transition-colors">
                                Batal
                            </button>
                            <button onClick={executeLogout} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
                                Ya, Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastNotification isVisible={toast.isVisible} message={toast.message} />

        </div>
    );
};

export default AccountSetting;