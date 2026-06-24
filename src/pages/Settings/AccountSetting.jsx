import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Shield, LogOut, ChevronRight, Check, X, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

    // ==========================================
    // 3. FUNGSI LOGIKA AKSI (SAVE HANDLERS)
    // ==========================================

    // Handler 1: Simpan Profil ke Database
    const handleSaveCardProfile = async () => {
        try {
            const token = localStorage.getItem('umkm_token');
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileForm)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setUser(data.user);
            localStorage.setItem('umkm_user', JSON.stringify(data.user));
            setIsEditingCard(false);
            alert("✅ Profil berhasil diperbarui di database!");
        } catch (error) {
            alert("❌ Gagal: " + error.message);
        }
    };

    // Handler 2: Update Password (Bcrypt & JWT)
    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("❌ Konfirmasi kata sandi baru tidak cocok!");
            return;
        }

        try {
            const token = localStorage.getItem('umkm_token');
            const response = await fetch('http://localhost:5000/api/auth/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    oldPassword: passwordForm.oldPassword,
                    newPassword: passwordForm.newPassword
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert("✅ " + data.message);
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setActiveSubPanel('none');
        } catch (error) {
            alert("❌ Gagal: " + error.message);
        }
    };

    // Handler 3: Logout
    const handleLogout = () => {
        localStorage.removeItem('umkm_token');
        navigate('/');
    };

    return (
        <div className="flex flex-col min-h-full w-full max-w-md mx-auto pb-24">

            {/* Header Utama */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Pengaturan Akun</h2>
            </div>

            {/* 1. KARTU PROFIL UTAMA */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-[#1A361D] shrink-0">
                    <User size={32} />
                </div>

                <div className="flex-1 overflow-hidden">
                    {isEditingCard ? (
                        <div className="space-y-2 animate-fade-in">
                            <input
                                type="text"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                className="w-full border-b border-gray-200 focus:border-[#A7D189] outline-none py-1 text-base font-bold text-gray-800 bg-transparent"
                            />
                            <input
                                type="email"
                                value={profileForm.email}
                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                className="w-full border-b border-gray-200 focus:border-[#A7D189] outline-none py-1 text-sm text-gray-500 bg-transparent"
                            />
                            <div className="flex gap-2 mt-2">
                                <button onClick={handleSaveCardProfile} className="flex-1 bg-[#10B981] text-white py-1.5 rounded-lg flex justify-center items-center gap-1 font-bold text-xs shadow-sm hover:bg-[#059669]">
                                    <Check size={14} /> Simpan
                                </button>
                                <button onClick={() => setIsEditingCard(false)} className="flex-1 bg-red-50 text-red-500 py-1.5 rounded-lg flex justify-center items-center gap-1 font-bold text-xs hover:bg-red-100">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <button
                    onClick={() => { setIsEditingCard(true); setActiveSubPanel('none'); }}
                    className={`w-full flex items-center justify-between p-4 border-b border-gray-50 transition-colors ${isEditingCard ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}
                >
                    <div className="flex items-center gap-3 text-gray-700">
                        <User size={20} className="text-[#A7D189]" />
                        <span className="font-semibold text-sm">Edit Profil Akun</span>
                    </div>
                    <ChevronRight size={18} className={`text-gray-400 transition-transform ${isEditingCard ? 'rotate-90' : ''}`} />
                </button>

                <button
                    onClick={() => { setActiveSubPanel(activeSubPanel === 'keamanan' ? 'none' : 'keamanan'); setIsEditingCard(false); }}
                    className={`w-full flex items-center justify-between p-4 transition-colors ${activeSubPanel === 'keamanan' ? 'bg-green-50/50' : 'hover:bg-gray-50'}`}
                >
                    <div className="flex items-center gap-3 text-gray-700">
                        <Shield size={20} className="text-[#A7D189]" />
                        <span className="font-semibold text-sm">Keamanan & Password</span>
                    </div>
                    <ChevronRight size={18} className={`text-gray-400 transition-transform ${activeSubPanel === 'keamanan' ? 'rotate-90' : ''}`} />
                </button>
            </div>

            {/* PANEL CONFIG: KEAMANAN & PASSWORD */}
            {activeSubPanel === 'keamanan' && (
                <form onSubmit={handleUpdatePassword} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 animate-slide-down space-y-4">
                    <div>
                        <h4 className="font-bold text-gray-800 text-base mb-1">Perbarui Kata Sandi</h4>
                        <p className="text-xs text-gray-400">Amankan akun manajer ERP Anda secara berkala.</p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">KATA SANDI SEKARANG</label>
                            <input
                                type="password"
                                required
                                value={passwordForm.oldPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A7D189]"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">KATA SANDI BARU</label>
                            <input
                                type="password"
                                required
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A7D189]"
                                placeholder="Minimal 6 karakter"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">KONFIRMASI KATA SANDI BARU</label>
                            <input
                                type="password"
                                required
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A7D189]"
                                placeholder="Ulangi kata sandi baru"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 bg-[#1A361D] hover:bg-[#122614] text-white font-bold rounded-xl text-sm transition-colors flex justify-center items-center gap-2 shadow-sm"
                    >
                        <Key size={16} /> Perbarui Kata Sandi
                    </button>
                </form>
            )}

            {/* Tombol Keluar Utama */}
            <button
                onClick={handleLogout}
                className="w-full py-4 bg-red-50 text-red-600 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-red-100 transition-colors shadow-sm"
            >
                <LogOut size={20} /> Keluar (Logout)
            </button>

        </div>
    );
};

export default AccountSetting;