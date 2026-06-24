import React from 'react';
import { Home, ScanLine, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { id: 'dashboard', path: '/dashboard', icon: Home, label: 'Dashboard' },
        { id: 'briefing', path: '/briefing', icon: ScanLine, label: 'Briefing' },
        // 👇 PERBAIKAN: path diubah dari '/profile' ke '/settings'
        { id: 'settings', path: '/settings', icon: User, label: 'Pengaturan' }
    ];

    return (
        <div className="fixed bottom-0 w-full md:hidden bg-[#1C1C24]/90 backdrop-blur-lg border-t border-white/5 pb-5 pt-3 px-8 z-50">
            <div className="flex justify-between items-center">
                {navItems.map((item) => {
                    // Cek apakah halaman sedang aktif
                    const isActive = location.pathname.includes(item.path);
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center transition-all duration-300 ease-out ${isActive ? 'text-[#A7D189] -translate-y-3' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <div className={`p-3 rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#A7D189]/10 shadow-[0_10px_20px_rgba(167,209,137,0.2)]' : 'bg-transparent hover:bg-white/5'
                                }`}>
                                <Icon size={isActive ? 24 : 22} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
                            </div>
                            {/* Titik indikator di bawah ikon aktif */}
                            <div className={`w-1.5 h-1.5 rounded-full bg-[#A7D189] mt-2 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;