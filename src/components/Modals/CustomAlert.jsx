import React from 'react';
import { AlertTriangle, ShoppingCart, X } from 'lucide-react';

export const CustomAlert = ({ isOpen, onClose, itemName, isBasi }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full p-4 z-[60] animate-slide-down flex justify-center pointer-events-none">
            <div className={`pointer-events-auto bg-white border-l-4 shadow-xl rounded-xl p-4 flex items-start gap-3 w-full max-w-sm ${isBasi ? 'border-orange-500' : 'border-yellow-500'}`}>
                {isBasi ? (
                    <AlertTriangle size={24} className="text-orange-500 shrink-0 mt-0.5" />
                ) : (
                    <ShoppingCart size={24} className="text-yellow-500 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 pr-4">
                    <h4 className="font-bold text-gray-800 text-sm">{isBasi ? 'Barang Mau Basi!' : 'Barang Mau Restock!'}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                        "<span className="font-semibold">{itemName}</span>" telah dipindahkan ke keranjang Sisihkan.
                    </p>
                </div>

                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 rounded-lg p-1 transition-colors">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};