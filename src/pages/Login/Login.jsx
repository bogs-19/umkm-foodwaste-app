import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Leaf } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();

    // State Management (Simplified for Demo)
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMsg('');
    };

    // Logika Submit (Simulasi Lokal Tanpa API)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!formData.email || !formData.password) {
            setErrorMsg('Harap isi username dan password.');
            return;
        }

        setIsLoading(true);

        // SIMULASI LOADING API (1.5 detik)
        setTimeout(() => {
            // HARDCODE VALIDASI DEMO: admin & admin123
            if (formData.email === 'admin' && formData.password === 'admin123') {

                // Set data pengguna dummy "Radhitama" ke LocalStorage
                const demoUser = {
                    id: '1',
                    name: 'Radhitama',
                    email: 'radhitama@umkm.com'
                };

                localStorage.setItem('umkm_token', 'demo-token-12345');
                localStorage.setItem('umkm_user', JSON.stringify(demoUser));

                // Arahkan ke Dashboard
                navigate('/dashboard');

            } else {
                setErrorMsg('Username atau password salah! Gunakan: admin / admin123');
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#D1D5DB] sm:p-6 md:p-12 font-sans">
            <div className="w-full max-w-[450px] bg-[#0F172A] sm:rounded-[32px] shadow-2xl overflow-hidden relative min-h-screen sm:min-h-0 border-4 sm:border-8 border-[#1E293B] flex flex-col justify-center">

                <div className="px-8 pt-12 pb-6 flex flex-col items-center relative z-10 animate-slide-down mt-10 sm:mt-0">
                    <div className="w-16 h-16 bg-[#1A361D] rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(167,209,137,0.3)]">
                        <Leaf size={32} className="text-[#A7D189]" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-gray-400 font-medium text-center px-4">
                        Enter your credentials to access your inventory dashboard.
                    </p>
                </div>

                <div className="flex-1 px-8 pb-10 flex flex-col z-10">

                    {errorMsg && (
                        <div className="mb-6 bg-red-900/30 border border-red-500/50 text-red-400 px-4 py-3 text-xs font-bold rounded-xl text-center animate-shake backdrop-blur-sm">
                            {errorMsg}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail size={18} className="text-gray-500 group-focus-within:text-[#A7D189] transition-colors" />
                            </div>
                            <input
                                type="text" name="email"
                                value={formData.email} onChange={handleChange}
                                placeholder="Username (admin)"
                                className="w-full pl-12 pr-4 py-4 bg-[#1E293B] border border-gray-700/50 rounded-2xl focus:outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all text-sm font-medium text-white placeholder-gray-500"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-500 group-focus-within:text-[#A7D189] transition-colors" />
                            </div>
                            <input
                                type="password" name="password"
                                value={formData.password} onChange={handleChange}
                                placeholder="Password (admin123)"
                                className="w-full pl-12 pr-4 py-4 bg-[#1E293B] border border-gray-700/50 rounded-2xl focus:outline-none focus:border-[#A7D189] focus:ring-1 focus:ring-[#A7D189] transition-all text-sm font-medium text-white placeholder-gray-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full mt-8 py-4 rounded-2xl font-bold text-[#0B1528] tracking-wide transition-all flex justify-center items-center gap-2 shadow-lg ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#A7D189] hover:bg-[#95C276] hover:scale-[1.02] active:scale-95 shadow-[#A7D189]/20'}`}
                        >
                            {isLoading && <Loader2 size={18} className="animate-spin text-[#0B1528]" />}
                            {isLoading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-600 font-bold tracking-widest uppercase">
                            Demo Version
                        </p>
                    </div>
                </div>

                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#A7D189]/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-[#1E3A8A]/20 rounded-full blur-3xl pointer-events-none"></div>
            </div>
        </div>
    );
};

export default Login;