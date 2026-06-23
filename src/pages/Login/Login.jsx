import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

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

    // Logika Submit (Terkoneksi API Asli)
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
                // Simpan token ke localStorage
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
        <div className="min-h-screen flex w-full bg-white">
            {/* BAGIAN KIRI: Ilustrasi */}
            <div className="hidden lg:flex w-1/2 bg-[#0B1528] relative overflow-hidden items-center justify-center">
                <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop"
                    alt="Illustration"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-10 text-center text-white px-12">
                    <h1 className="text-5xl font-bold tracking-widest mb-4">WELCOME</h1>
                    <p className="text-lg text-gray-300">Sistem Manajemen Food Waste UMKM</p>
                </div>
            </div>

            {/* BAGIAN KANAN: Form Dinamis */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 md:p-20">
                <div className="w-full max-w-md space-y-8 animate-fade-in">

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-[#0B1528] mb-2">
                            {isLogin ? 'Login' : 'Buat Akun Baru'}
                        </h2>
                        <p className="text-gray-500">
                            {isLogin
                                ? 'Masuk ke akun Anda untuk mengelola inventaris'
                                : 'Daftarkan UMKM Anda ke sistem kami'}
                        </p>
                    </div>

                    {/* Pesan Error & Success */}
                    {errorMsg && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm font-medium rounded-r-lg">
                            {errorMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 text-sm font-medium rounded-r-lg">
                            {successMsg}
                        </div>
                    )}

                    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>

                        {/* Input Nama (Hanya muncul saat Sign Up) */}
                        {!isLogin && (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nama Lengkap / Nama UMKM"
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A7D189] focus:bg-white transition-all"
                                />
                            </div>
                        )}

                        {/* Input Email */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="baguspratama5000@gmail.com"
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A7D189] focus:bg-white transition-all"
                            />
                        </div>

                        {/* Input Password */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••••••"
                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A7D189] focus:bg-white transition-all"
                            />
                        </div>

                        {/* Lupa Password (Hanya muncul saat Login) */}
                        {isLogin && (
                            <div className="flex justify-end mb-6">
                                <button type="button" className="text-sm font-medium text-gray-600 hover:text-[#1A361D] transition-colors">
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        {/* Tombol Utama Dinamis dengan status Loading */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-all flex justify-center items-center gap-2 mt-4 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1A361D] hover:bg-[#122614] hover:shadow-lg'
                                }`}
                        >
                            {isLoading && <Loader2 size={18} className="animate-spin" />}
                            {isLoading ? 'Memproses...' : (isLogin ? 'Login' : 'Daftar Sekarang')}
                        </button>

                        {/* Teks Toggle Login/Signup */}
                        <p className="text-center text-sm text-gray-600 mt-8">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={toggleMode}
                                type="button"
                                className="font-bold text-[#1A361D] hover:underline"
                            >
                                {isLogin ? 'Sign up' : 'Login'}
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;