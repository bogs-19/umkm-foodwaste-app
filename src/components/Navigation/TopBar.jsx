import React from 'react';
import { Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 👈 Import ini

export const TopBar = ({ onMenuClick, title }) => {
    const navigate = useNavigate(); // 👈 Inisialisasi navigasi

    return (
        <div className="sticky top-0 z-40 w-full bg-[#13131A]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center transition-all">

            {/* 👇 Tambahkan onClick untuk navigasi ke /settings */}
            <div
                onClick={() => navigate('/settings')}
                className="w-10 h-10 rounded-[14px] bg-[#1C1C24] border border-white/10 flex items-center justify-center text-[#A7D189] shadow-sm hover:shadow-[#A7D189]/20 hover:scale-105 transition-all cursor-pointer"
                title="Pengaturan Akun"
            >
                <User size={20} />
            </div>

            {/* Judul Halaman Dinamis dari MainLayout */}
            <h1 className="text-lg font-black tracking-widest text-white uppercase">{title || 'Dashboard'}</h1>

            <button onClick={onMenuClick} className="p-2 text-gray-400 hover:text-[#A7D189] transition-colors rounded-xl hover:bg-white/5">
                <Menu size={24} />
            </button>
        </div>
    );
};