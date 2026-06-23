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
        if (location.pathname.includes('/settings')) return 'Pengaturan';
        return 'UMKM App';
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-16 sm:pb-0 flex flex-col md:flex-row overflow-hidden relative">
            <aside className="hidden md:flex w-64 bg-[#0B1528] text-white flex-col shadow-xl z-20">
                <div className="p-6 text-xl font-bold tracking-wider text-[#A7D189]">FOODWASTE</div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
                        <Home size={20} /> Dashboard
                    </Link>
                    <Link to="/briefing" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
                        <ScanLine size={20} /> Briefing Pagi
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col relative w-full h-screen overflow-y-auto">
                {/* Memanggil Komponen TopBar */}
                <TopBar title={getPageTitle()} onMenuClick={() => setIsMenuOpen(true)} />

                <div className="p-4 sm:p-6 lg:p-8 flex-1">
                    <Outlet />
                </div>
            </main>

            {/* Memanggil Komponen HamburgerMenu */}
            <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <BottomNav />
        </div>
    );
};

export default MainLayout;