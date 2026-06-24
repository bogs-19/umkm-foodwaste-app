import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Home, ScanLine, PieChart, LogOut, Package, Tag, HeartHandshake, ShoppingCart } from 'lucide-react';

export const HamburgerMenu = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('umkm_token');
        localStorage.removeItem('umkm_user');
        localStorage.removeItem('umkm_disisihkan');
        localStorage.removeItem('umkm_briefing_queue');
        onClose();
        navigate('/');
    };

    return (
        <>
            {/* Overlay Gelap (Menghapus md:hidden agar bisa muncul di PC) */}
            {isOpen && (
                <div className="fixed inset-0 bg-[#0B1528]/60 z-[60] backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            )}

            {/* Panel Menu Samping (Dark Mode Premium) */}
            <div className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-[#1C1C24] z-[70] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] border-l border-white/5 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header Hamburger */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#13131A] text-white">
                    <span className="font-black text-lg tracking-widest text-[#A7D189]">MENU UMKM</span>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white">
                        <X size={22} />
                    </button>
                </div>

                {/* List Menu Navigasi */}
                <nav className="flex-1 px-5 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    <Link to="/dashboard" onClick={onClose} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-[#A7D189] font-medium tracking-wide transition-all">
                        <div className="p-2 bg-[#13131A] rounded-xl border border-white/5"><Home size={18} /></div>
                        Dashboard Utama
                    </Link>
                    <Link to="/briefing" onClick={onClose} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-[#A7D189] font-medium tracking-wide transition-all">
                        <div className="p-2 bg-[#13131A] rounded-xl border border-white/5"><ScanLine size={18} /></div>
                        Briefing (Swipe)
                    </Link>

                    <div className="pt-4 pb-2">
                        <p className="px-3 text-[10px] font-bold tracking-widest text-gray-500 uppercase">Manajemen Inventaris</p>
                    </div>

                    <Link to="/daftar-bahan" onClick={onClose} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-[#A7D189] font-medium tracking-wide transition-all">
                        <div className="p-2 bg-[#13131A] rounded-xl border border-white/5"><Package size={18} /></div>
                        Macam-macam Bahan
                    </Link>

                    <Link to="/restock" onClick={onClose} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-[#A7D189] font-medium tracking-wide transition-all">
                        <div className="p-2 bg-[#13131A] rounded-xl border border-white/5"><ShoppingCart size={18} /></div>
                        Daftar Belanja
                    </Link>

                    <Link to="/promo" onClick={onClose} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-[#A7D189] font-medium tracking-wide transition-all">
                        <div className="p-2 bg-[#13131A] rounded-xl border border-white/5"><Tag size={18} /></div>
                        Bahan Dipromosikan
                    </Link>
                    <Link to="/donasi" onClick={onClose} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-[#A7D189] font-medium tracking-wide transition-all">
                        <div className="p-2 bg-[#13131A] rounded-xl border border-white/5"><HeartHandshake size={18} /></div>
                        Barang Didonasikan
                    </Link>

                    <div className="pt-4 pb-2 border-t border-white/5 mt-4"></div>

                    <Link to="/statistik" onClick={onClose} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-[#A7D189] font-medium tracking-wide transition-all">
                        <div className="p-2 bg-[#13131A] rounded-xl border border-white/5"><PieChart size={18} /></div>
                        Laporan & Statistik
                    </Link>
                </nav>

                {/* Footer Keluar Menu */}
                <div className="p-5 border-t border-white/5 bg-[#13131A]">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 font-bold transition-colors">
                        <LogOut size={20} /> Keluar (Logout)
                    </button>
                </div>
            </div>
        </>
    );
};