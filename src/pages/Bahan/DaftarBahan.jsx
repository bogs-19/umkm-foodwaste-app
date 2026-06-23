import React, { useState } from 'react';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dummyInventory } from '../../data/dummyInventory';
import { BahanCard } from '../../components/Cards/BahanCard';

const DaftarBahan = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Logika filter pencarian sederhana
    const filteredBahan = dummyInventory.filter(item =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto pb-6">

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Semua Inventaris</h2>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari bahan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#A7D189]"
                    />
                </div>
                <button className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 flex items-center justify-center">
                    <Filter size={20} />
                </button>
            </div>

            {/* Grid List Bahan */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredBahan.map((item) => (
                    <BahanCard key={item.id} item={item} onClick={() => navigate(`/bahan/${item.id}`)} />
                ))}
            </div>
            {filteredBahan.length === 0 && (
                <div className="text-center py-10 text-gray-500">Bahan tidak ditemukan.</div>
            )}

        </div>
    );
};

export default DaftarBahan;