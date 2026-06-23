import React from 'react';
import { X } from 'lucide-react';

export const AcrionModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Yakin", cancelText = "Batal" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-gray-100 p-6 flex flex-col transform transition-all">

                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Deskripsi Pertanyaan Konfirmasi */}
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>

                {/* Tombol Aksi Kiri (Batal) dan Kanan (Konfirmasi) */}
                <div className="flex gap-3 mt-auto">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 bg-[#1A361D] text-white font-semibold rounded-xl hover:bg-[#122614] shadow-md transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>

            </div>
        </div>
    );
};