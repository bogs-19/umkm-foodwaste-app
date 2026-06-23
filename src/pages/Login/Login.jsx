import { useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault(); 

        navigate('/dashboard');
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        alert("Untuk prototipe Sprint ini, kita fokus ke alur Staf/Manajer dulu ya!");
    };

    return (
        <div className="min-h-screen flex w-full bg-white">
            {/* BAGIAN KIRI: Ilustrasi (Sembunyi di Mobile) */}
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

            {/* BAGIAN KANAN: Form Login */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 md:p-20">
                <div className="w-full max-w-md space-y-8">

                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-[#0B1528] mb-2">Login</h2>
                        <p className="text-gray-500">Masuk ke akun Anda untuk mengelola inventaris</p>
                    </div>

                    {/* 4. Tambahkan onSubmit pada form untuk menangani tombol Enter dan klik */}
                    <form className="mt-8 space-y-4" onSubmit={handleLogin}>
                        <Input
                            type="email"
                            placeholder="baguspratama5000@gmail.com"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>}
                        />
                        <Input
                            type="password"
                            placeholder="••••••••••••"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
                        />

                        <div className="flex justify-end mb-6">
                            <button type="button" className="text-sm font-medium text-gray-600 hover:text-[#1A361D] transition-colors">
                                Forgot Password?
                            </button>
                        </div>

                        {/* Tombol otomatis memicu onSubmit pada form karena tipe defaultnya adalah "submit" */}
                        <Button variant="primary">Login</Button>

                        <div className="relative flex items-center py-5">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        {/* Tambahkan type="button" agar tidak ikut men-submit form */}
                        <Button variant="outline" type="button" onClick={() => navigate('/dashboard')}>
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            Continue with Google
                        </Button>

                        <p className="text-center text-sm text-gray-600 mt-8">
                            Don't have an account?{' '}
                            <button onClick={handleSignUp} type="button" className="font-semibold text-[#0B1528] hover:underline">
                                Sign up
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;