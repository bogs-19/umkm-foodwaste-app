import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, Leaf } from 'lucide-react'; // Mengganti ikon untuk kesan organik/green

const Login = () => {
    const navigate = useNavigate();

    // State Management
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMsg('');
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setErrorMsg('');
        setSuccessMsg('');
        setFormData({ name: '', email: '', password: '' });
    };

    // Logika Submit (Terkoneksi API)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
            setErrorMsg('Harap isi semua kolom yang wajib.');
            return;
        }

        setIsLoading(true);

        try {
            const endpoint = isLogin
                ? 'http://localhost:5000/api/auth/login'
                : 'http://localhost:5000/api/auth/register';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Terjadi kesalahan");
            }

            if (isLogin) {
                localStorage.setItem('umkm_token', data.token);
                localStorage.setItem('umkm_user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                setSuccessMsg(data.message);
                setIsLogin(true);
                setFormData({ name: '', email: formData.email, password: '' });
            }

        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // BACKGROUND UTAMA: Abu-abu terang (Seperti di luar iPad pada referensi ke-2)
        <div className="min-h-screen w-full flex items-center justify-center bg-[#D1D5DB] sm:p-6 md:p-12 font-sans">

            {/* CONTAINER "IPAD/TABLET CARD" (Dark Mode) */}
            <div className="w-full max-w-[500px] bg-[#0F172A] sm:rounded-[32px] shadow-2xl overflow-hidden relative min-h-screen sm:min-h-0 border-4 sm:border-8 border-[#1E293B] flex flex-col">

                {/* ================================================== */}
                {/* HEADER AREA: LOGO & JUDUL */}
                {/* ================================================== */}
                <div className="px-8 pt-12 pb-6 flex flex-col items-center relative z-10 animate-slide-down">
                    {/* Ikon/Logo Pengganti Gambar */}
                    <div className="w-16 h-16 bg-[#1A361D] rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(167,209,137,0.3)]">
                        <Leaf size={32} className="text-[#A7D189]" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                        {isLogin ? 'Welcome Back' : 'Join the Movement'}
                    </h2>
                    <p className="text-sm text-gray-400 font-medium text-center px-4">
                        {isLogin
                            ? 'Enter your credentials to access your inventory dashboard.'
                            : 'Sign up to start managing food waste efficiently.'}
                    </p>
                </div>

                {/* ================================================== */}
                {/* AREA FORM */}
                {/* ================================================== */}
                <div className="flex-1 px-8 pb-10 flex flex-col z-10">

                    {/* Notifikasi Error/Success */}
                    {errorMsg && (
                        <div className="mb-6 bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 text-xs font-bold rounded-xl text-center animate-shake backdrop-blur-sm">
                            {errorMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-6 bg-[#A7D189]/10 border border-[#A7D189]/30 text-[#A7D189] px-4 py-3 text-xs font-bold rounded-xl text-center animate-fade-in backdrop-blur-sm">
                            {successMsg}
                        </div>
                    )}

                    <form className="space-y-5 flex-1" onSubmit={handleSubmit}>

                        {/* Input Nama (Sign Up) */}
                        {!isLogin && (
                            <div className="relative animate-fade-in group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User size={18} className="text-gray-500 group-focus-within:text-[#A7D189] transition-colors" />
                                </div>
                                <input
                                    type="text" name="name"
                                    value={formData.name} onChange={handleChange}
                                    placeholder="Company Name"
                                    className="w-full pl-12 pr-4 py-4 bg-[#1E293B] border border-gray-700/50 rounded-2xl focus:outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all text-sm font-medium text-white placeholder-gray-500"
                                />
                            </div>
                        )}

                        {/* Input Email */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={18} className="text-gray-500 group-focus-within:text-[#A7D189] transition-colors" />
                            </div>
                            <input
                                type="email" name="email"
                                value={formData.email} onChange={handleChange}
                                placeholder="Email address"
                                className="w-full pl-12 pr-4 py-4 bg-[#1E293B] border border-gray-700/50 rounded-2xl focus:outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all text-sm font-medium text-white placeholder-gray-500"
                            />
                        </div>

                        {/* Input Password */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-500 group-focus-within:text-[#A7D189] transition-colors" />
                            </div>
                            <input
                                type="password" name="password"
                                value={formData.password} onChange={handleChange}
                                placeholder="Password"
                                className="w-full pl-12 pr-4 py-4 bg-[#1E293B] border border-gray-700/50 rounded-2xl focus:outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all text-sm font-medium text-white placeholder-gray-500"
                            />
                        </div>

                        {/* Lupa Password Link */}
                        {isLogin && (
                            <div className="flex justify-end mb-6">
                                <button type="button" className="text-xs font-bold text-gray-400 hover:text-[#A7D189] transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {/* Tombol Utama (Aksen Hijau) */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full mt-6 py-4 rounded-2xl font-bold text-[#0B1528] tracking-wide transition-all flex justify-center items-center gap-2 shadow-lg ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#A7D189] hover:bg-[#95C276] hover:scale-[1.02] active:scale-95 shadow-[#A7D189]/20'
                                }`}
                        >
                            {isLoading && <Loader2 size={18} className="animate-spin text-[#0B1528]" />}
                            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    {/* Toggle Text di Bawah */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button onClick={toggleMode} type="button" className="font-bold text-white hover:text-[#A7D189] transition-colors ml-1 border-b border-transparent hover:border-[#A7D189]">
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>

                </div>

                {/* Dekorasi Cahaya Halus di Latar Belakang Kotak Hitam (Glow effects) */}
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#A7D189]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-[#1E3A8A]/20 rounded-full blur-3xl pointer-events-none"></div>

            </div>
        </div>
    );
};

export default Login;