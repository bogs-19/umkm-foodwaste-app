import React from 'react';
import { ArrowLeft, User, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountSetting = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto pb-6">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Pengaturan Akun</h2>
            </div>

            {/* Kartu Profil Utama */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-[#1A361D] shrink-0">
                    <User size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Bagus Radhit</h3>
                    <p className="text-sm text-gray-500 mb-1">Manajer Operasional</p>
                    <span className="px-2 py-1 bg-[#1A361D] text-white text-[10px] font-bold rounded-md">UMKM Admin</span>
                </div>
            </div>

            {/* Daftar Menu Pengaturan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <button className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 text-gray-700">
                        <User size={20} className="text-[#A7D189]" />
                        <span className="font-medium">Edit Profil</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 text-gray-700">
                        <Bell size={20} className="text-[#A7D189]" />
                        <span className="font-medium">Notifikasi FEFO</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 text-gray-700">
                        <Shield size={20} className="text-[#A7D189]" />
                        <span className="font-medium">Keamanan & Password</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                </button>
            </div>

            {/* Tombol Logout */}
            <button
                onClick={() => navigate('/')}
                className="w-full py-4 bg-red-50 text-red-600 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-red-100 transition-colors"
            >
                <LogOut size={20} /> Keluar (Logout)
            </button>

        </div>
    );
};

export default AccountSetting;