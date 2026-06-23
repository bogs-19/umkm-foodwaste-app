import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Menu, User, X, Home, ScanLine, PieChart, LogOut, Package, Tag, HeartHandshake } from 'lucide-react';
import BottomNav from '../components/Navigation/BottomNav';

const MainLayout = () => {
    const location = useLocation();
    // 1. State untuk mengontrol status Hamburger Menu (Buka/Tutup)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getPageTitle = () => {
        if (location.pathname.includes('/dashboard')) return 'Dashboard Utama';
        if (location.pathname.includes('/briefing')) return 'Briefing Pagi';
        if (location.pathname.includes('/settings')) return 'Pengaturan';
        return 'UMKM App';
    };

    // 2. Fungsi untuk menutup menu setelah link diklik
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-16 sm:pb-0 flex flex-col md:flex-row overflow-hidden relative">

            {/* Sidebar Statis untuk Desktop (Layar Besar) */}
            <aside className="hidden md:flex w-64 bg-[#0B1528] text-white flex-col shadow-xl z-20">
                <div className="p-6 text-xl font-bold tracking-wider text-[#A7D189]">FOODWASTE</div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
                        <Home size={20} /> Dashboard
                    </Link>
                    <Link to="/briefing" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
                        <ScanLine size={20} /> Briefing Pagi
                    </Link>
                    {/* Menu Statistik nanti bisa ditambahkan di sini */}
                </nav>
            </aside>

            {/* Area Konten Utama */}
            <main className="flex-1 flex flex-col relative w-full h-screen overflow-y-auto">

                {/* Top App Bar (Mobile & Tablet) */}
                <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-30 px-4 py-3 flex justify-between items-center md:hidden">

                    {/* Tombol Akun/Profil yang sudah aktif */}
                    <Link to="/settings" className="p-2 text-gray-600 hover:bg-[#A7D189] hover:text-white rounded-full transition-colors bg-green-50">
                        <User size={24} className="text-[#1A361D]" />
                    </Link>

                    <h1 className="text-lg font-semibold text-gray-800">{getPageTitle()}</h1>
                    {/* 3. Tombol Hamburger dengan event onClick untuk membuka menu */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 text-gray-600 hover:bg-[#A7D189] hover:text-white rounded-full transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                <div className="p-4 sm:p-6 lg:p-8 flex-1">
                    <Outlet />
                </div>
            </main>

            {/* --- BAGIAN HAMBURGER MENU (DRAWER) --- */}

            {/* Overlay Gelap (Backdrop) - Muncul jika isMenuOpen true */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={closeMenu} // Tutup menu jika area gelap diklik
                ></div>
            )}

            {/* Panel Menu Samping (Slide dari kanan) */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#0B1528] text-white">
                    <span className="font-bold text-lg tracking-wider text-[#A7D189]">MENU UMKM</span>
                    <button onClick={closeMenu} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">

                    {/* Menu Utama */}
                    <Link to="/dashboard" onClick={closeMenu} className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-[#1A361D] font-medium transition-colors">
                        <Home size={22} /> Dashboard Utama
                    </Link>
                    <Link to="/briefing" onClick={closeMenu} className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-[#1A361D] font-medium transition-colors">
                        <ScanLine size={22} /> Briefing (Fitur Swipe)
                    </Link>

                    {/* Pemisah Visual (Divider) */}
                    <div className="pt-2 pb-1">
                        <p className="px-3 text-xs font-bold tracking-wider text-gray-400 uppercase">Manajemen Inventaris</p>
                    </div>

                    {/* 3 Menu Baru Sesuai Request */}
                    <Link to="/daftar-bahan" onClick={closeMenu} className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-[#1A361D] font-medium transition-colors">
                        <Package size={22} /> Macam-macam Bahan
                    </Link>
                    <Link to="/promo" onClick={closeMenu} className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-[#1A361D] font-medium transition-colors">
                        <Tag size={22} /> Bahan Dipromosikan
                    </Link>
                    <Link to="/donasi" onClick={closeMenu} className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-[#1A361D] font-medium transition-colors">
                        <HeartHandshake size={22} /> Barang Didonasikan
                    </Link>

                    {/* Pemisah Visual (Divider) */}
                    <div className="pt-2 pb-1 border-t border-gray-100"></div>

                    <Link to="/statistik" onClick={closeMenu} className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-[#1A361D] font-medium transition-colors">
                        <PieChart size={22} /> Laporan & Statistik
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link to="/" onClick={closeMenu} className="flex items-center gap-4 p-3 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-colors">
                        <LogOut size={22} /> Keluar (Logout)
                    </Link>
                </div>
            </div>
            {/* --- AKHIR BAGIAN HAMBURGER MENU --- */}

            <BottomNav />
        </div>
    );
};

export default MainLayout;