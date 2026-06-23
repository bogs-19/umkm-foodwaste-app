import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, TrendingUp, PackageCheck, Tag } from 'lucide-react';
import { dummyInventory } from '../../data/dummyInventory';
import { StatistikCard } from '../../components/Cards/StatistikCard';

const Dashboard = () => {
    const navigate = useNavigate();
    const [bahanKritis, setBahanKritis] = useState([]);

    // Simulasi sistem memonitor bahan baku (Sistem FEFO)
    useEffect(() => {
        const kritis = dummyInventory.filter(item => item.status === 'Kritis');
        setBahanKritis(kritis);
    }, []);

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto space-y-6">

            {/* Header Greeting */}
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Halo, Bagus!</h2>
                <p className="text-gray-500 mt-1">Berikut adalah ringkasan inventaris dapurmu hari ini.</p>
            </div>

            {/* 1. NOTIFIKASI ALERT FEFO (Meniru Sketsa "Kotak 6") */}
            {bahanKritis.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl shadow-sm animate-fade-in relative overflow-hidden">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="ml-4 flex-1">
                            <h3 className="text-lg font-bold text-red-800">
                                AWAS! {bahanKritis.length} Bahan Segera Basi
                            </h3>
                            <div className="mt-2 text-sm text-red-700 space-y-2">
                                {bahanKritis.slice(0, 2).map((item) => (
                                    <div key={item.id} className="flex justify-between items-center bg-white/50 p-2 rounded-lg">
                                        <span className="font-semibold">{item.nama} ({item.sisa})</span>
                                        <span className="font-bold text-red-600 px-2 py-1 bg-white rounded-md text-xs">
                                            Sisa: {item.sisaWaktu}
                                        </span>
                                    </div>
                                ))}
                                {bahanKritis.length > 2 && (
                                    <p className="text-xs italic mt-2">+ {bahanKritis.length - 2} bahan lainnya...</p>
                                )}
                            </div>

                            {/* Tombol Aksi Cepat (Shortcut Promo) */}
                            <div className="mt-4">
                                <button
                                    onClick={() => navigate('/eksekusi-promo')}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <Tag size={16} />
                                    Buat Promo Flash Sale Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Statistik Ringkas (Widget) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <StatistikCard
                    icon={<PackageCheck size={32} />}
                    title="Total Stok Aman"
                    value={`${dummyInventory.filter(i => i.status === 'Aman').length} Item`}
                    colorClass="text-green-500"
                />
                <StatistikCard
                    icon={<TrendingUp size={32} />}
                    title="Food Waste Dicegah"
                    value="60%"
                    colorClass="text-blue-500"
                />
            </div>

        </div>
    );
};

export default Dashboard;