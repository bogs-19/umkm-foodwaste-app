import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Home, ScanLine } from 'lucide-react';
import BottomNav from '../components/Navigation/BottomNav';
import { TopBar } from '../components/Navigation/TopBar';
import { HamburgerMenu } from '../components/Navigation/HamburgerMenu';

const MainLayout = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getPageTitle = () => {
        if (location.pathname.includes('/dashboard')) return 'Dashboard Utama';
        if (location.pathname.includes('/briefing')) return 'Briefing Pagi';
        if (location.pathname.includes('/settings')) return 'Pengaturan Akun';
        return 'UMKM App';
    };

    return (
        <div className="min-h-screen bg-[#13131A] text-white pb-16 sm:pb-0 flex flex-col md:flex-row overflow-hidden relative font-sans">

            {/* ============================================================== */}
            {/* SIDEBAR KIRI DESKTOP (Ultra Premium Dark Mode)                 */}
            {/* ============================================================== */}
            <aside className="hidden md:flex w-72 bg-[#1C1C24] text-white flex-col shadow-[10px_0_30px_rgba(0,0,0,0.4)] z-20 border-r border-white/5 relative">

                {/* Logo Area */}
                <div className="p-8 text-2xl font-black tracking-widest text-[#A7D189] flex items-center gap-3 border-b border-white/5 bg-[#13131A]/30">
                    FOODWASTE
                </div>

                {/* Menu Navigasi Samping */}
                <nav className="flex-1 px-5 py-8 space-y-3 mt-2">

                    <Link
                        to="/dashboard"
                        className={`flex items-center gap-4 p-4 rounded-2xl font-semibold tracking-wide transition-all duration-300 ${location.pathname.includes('/dashboard')
                                ? 'bg-[#A7D189]/10 text-[#A7D189] shadow-inner border border-[#A7D189]/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Home size={22} className={location.pathname.includes('/dashboard') ? 'stroke-[2.5px]' : 'stroke-2'} />
                        Dashboard
                    </Link>

                    <Link
                        to="/briefing"
                        className={`flex items-center gap-4 p-4 rounded-2xl font-semibold tracking-wide transition-all duration-300 ${location.pathname.includes('/briefing')
                                ? 'bg-[#A7D189]/10 text-[#A7D189] shadow-inner border border-[#A7D189]/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <ScanLine size={22} className={location.pathname.includes('/briefing') ? 'stroke-[2.5px]' : 'stroke-2'} />
                        Briefing Pagi
                    </Link>

                </nav>

                {/* Dekorasi Ambient Halus di bawah Sidebar */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#13131A] to-transparent pointer-events-none opacity-50"></div>
            </aside>

            {/* Area Konten Utama */}
            <main className="flex-1 flex flex-col relative w-full h-screen overflow-y-auto bg-transparent">
                <TopBar title={getPageTitle()} onMenuClick={() => setIsMenuOpen(true)} />

                <div className="flex-1 relative">
                    <Outlet />
                </div>
            </main>

            <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <BottomNav />
        </div>
    );
};

export default MainLayout;