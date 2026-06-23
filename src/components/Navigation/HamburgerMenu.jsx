import React from 'react';
import { Link } from 'react-router-dom';
import { X, Home, ScanLine, PieChart, LogOut, Package, Tag, HeartHandshake } from 'lucide-react';

export const HamburgerMenu = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Overlay Gelap */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            )}

            {/* Panel Menu Samping */}
            <div className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#0B1528] text-white">
                    <span className="font-bold text-lg tracking-wider text-[#A7D189]">MENU UMKM</span>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
                    <Link to="/dashboard" onClick={onClose} className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-[#1A361D] font-medium transition-colors">
                        <Home size={22} /> Dashboard Utama
                    </Link>
                    <Link to="/briefing" onClick={onClose} className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-[#1A361D] font-medium transition-colors">
                        <ScanLine size={22} /> Briefing (Fitur Swipe)
                    </Link>

                    <div className="pt-2 pb-1">
                        <p className="px-3 text-xs font-bold tracking-wider text-gray-400 uppercase">Manajemen Inventaris</p>
                    </div>

                    <Link to="/daftar-bahan" onClick={onClose} className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-[#1A361D] font-medium transition-colors">
                        <Package size={22} /> Macam-macam Bahan
                    </Link>
                    <Link to="/promo" onClick={onClose} className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-[#1A361D] font-medium transition-colors">
                        <Tag size={22} /> Bahan Dipromosikan
                    </Link>
                    <Link to="/donasi" onClick={onClose} className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-[#1A361D] font-medium transition-colors">
                        <HeartHandshake size={22} /> Barang Didonasikan
                    </Link>

                    <div className="pt-2 pb-1 border-t border-gray-100"></div>

                    <Link to="/statistik" onClick={onClose} className="flex items-center gap-4 p-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-[#1A361D] font-medium transition-colors">
                        <PieChart size={22} /> Laporan & Statistik
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link to="/" onClick={onClose} className="flex items-center gap-4 p-3 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-colors">
                        <LogOut size={22} /> Keluar (Logout)
                    </Link>
                </div>
            </div>
        </>
    );
};