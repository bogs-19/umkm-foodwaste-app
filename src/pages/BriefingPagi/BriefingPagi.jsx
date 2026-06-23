import React, { useState } from 'react';
import TinderCard from 'react-tinder-card';
import { Search, CheckCircle } from 'lucide-react';
import { dummyInventory } from '../../data/dummyInventory';

const BriefingPagi = () => {
    const [bahan, setBahan] = useState(dummyInventory);
    const [searchQuery, setSearchQuery] = useState('');

    const [cardsLeft, setCardsLeft] = useState(dummyInventory.length);

    const swiped = (direction, nameToDelete) => {
        console.log('Menghapus: ' + nameToDelete + ' ke arah ' + direction);
    };

    const outOfFrame = (name) => {
        console.log(name + ' telah keluar dari layar!');
        setCardsLeft((prev) => prev - 1);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-md mx-auto">

            <div className="flex-none mb-6 relative z-10">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search size={20} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Cari bahan manual..."
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A7D189] transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex-1 relative flex justify-center items-center w-full min-h-[420px]">

                {cardsLeft === 0 && (
                    <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex justify-center items-center mb-6 shadow-inner">
                            <CheckCircle size={48} className="text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Briefing Selesai!</h2>
                        <p className="text-gray-500 max-w-[250px]">
                            Semua status bahan baku hari ini telah berhasil diperbarui ke sistem.
                        </p>
                    </div>
                )}

                {bahan.map((item) => (
                    <TinderCard
                        className="absolute"
                        key={item.id}
                        onSwipe={(dir) => swiped(dir, item.nama)}
                        onCardLeftScreen={() => outOfFrame(item.nama)}
                        preventSwipe={['up', 'down']}
                    >
                        <div className="w-[300px] h-[400px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col cursor-grab active:cursor-grabbing">
                            <div className="h-[60%] w-full bg-gray-200 relative">
                                <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover pointer-events-none" />
                                <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full text-white shadow-sm ${item.status === 'Kritis' ? 'bg-red-500' : 'bg-green-500'}`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="p-6 flex flex-col justify-center flex-1 text-center bg-white pointer-events-none">
                                <h3 className="text-2xl font-bold text-gray-800">{item.nama}</h3>
                                <p className="text-gray-500 mt-2 font-medium">Sisa: {item.sisa}</p>
                            </div>
                        </div>
                    </TinderCard>
                ))}
            </div>

            {cardsLeft > 0 && (
                <div className="flex-none mt-auto pt-8 flex justify-between px-8 text-sm font-bold text-gray-400 z-10 transition-opacity">
                    <div className="flex flex-col items-center">
                        <span className="text-red-400 mb-1">← GESER KIRI</span>
                        <span>HABIS/BUANG</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[#1A361D] mb-1">GESER KANAN →</span>
                        <span>STOK AMAN</span>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BriefingPagi;