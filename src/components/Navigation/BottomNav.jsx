import { Link, useLocation } from 'react-router-dom';
import { Home, ScanLine, User } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Data menu navigasi
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <Home size={24} /> },
        { name: 'Briefing', path: '/briefing', icon: <ScanLine size={24} /> },
        { name: 'Profile', path: '/settings', icon: <User size={24} /> },
    ];

    return (
        <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-50 sm:hidden">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? 'text-[#1A361D]' : 'text-gray-400 hover:text-[#A7D189]'
                                }`}
                        >
                            <div className={`${isActive ? 'bg-green-50 p-1.5 rounded-xl' : ''} transition-all duration-300`}>
                                {item.icon}
                            </div>
                            <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;