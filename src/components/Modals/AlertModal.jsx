import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export const AlertModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all">

                {/* Header Modal - Menggunakan tema warna merah alert */}
                <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-red-50 text-red-700">
                    <div className="flex items-center gap-2 font-bold">
                        <AlertTriangle size={20} />
                        <span>{title || 'Peringatan Sistem'}</span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-red-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Konten Fleksibel di dalam Modal */}
                <div className="p-6 bg-white">
                    {children}
                </div>

            </div>
        </div>
    );
};