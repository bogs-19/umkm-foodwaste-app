import React from 'react';
import { Download, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BarChart3 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LaporanStatistik = () => {
    const navigate = useNavigate();
    const handleDownloadPDF = () => window.print();

    const chartOptions = {
        responsive: true,
        plugins: { legend: { position: 'bottom', labels: { color: '#13131A', font: { weight: 'bold' } } }, title: { display: false } },
        scales: {
            x: { ticks: { color: '#64748B', font: { weight: '600' } }, grid: { display: false } },
            y: { beginAtZero: true, ticks: { color: '#64748B' }, grid: { color: '#E2E8F0' } }
        }
    };

    const chartData = {
        labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
        datasets: [
            { label: 'Bahan Diselamatkan (kg)', data: [12, 19, 15, 22, 28, 35, 40], backgroundColor: '#A7D189', borderRadius: 6 },
            { label: 'Bahan Terbuang (kg)', data: [5, 2, 4, 1, 0, 2, 1], backgroundColor: '#EF4444', borderRadius: 6 },
        ],
    };

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto pb-24 text-white font-sans relative px-4 pt-6 print:bg-white print:p-0 print:text-black">

            {/* Header Halaman */}
            <div className="flex items-center justify-between mb-8 print:hidden">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 bg-[#1C1C24] border border-white/5 rounded-full hover:bg-white/10 transition-colors"><ArrowLeft size={20} className="text-gray-300" /></button>
                    <h2 className="text-2xl font-black tracking-wide">Laporan & Statistik</h2>
                </div>
                <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-[#A7D189] text-[#13131A] px-5 py-2.5 rounded-xl text-sm font-black hover:bg-[#95C276] transition-colors shadow-[0_10px_20px_rgba(167,209,137,0.2)] active:scale-95">
                    <Download size={18} /> Unduh PDF
                </button>
            </div>

            {/* Judul Dokumen (Hanya untuk Print PDF) */}
            <div className="hidden print:block text-center mb-8">
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-wider">Laporan Food Waste</h1>
                <p className="text-gray-500 font-bold mt-1">Periode: Minggu Terakhir</p>
                <hr className="mt-6 border-2 border-gray-900" />
            </div>

            {/* Ringkasan Angka (Dark Mode) */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#1C1C24] p-6 rounded-[28px] shadow-lg border border-white/5 print:shadow-none print:border-gray-300 print:bg-gray-50 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#A7D189]/5 rounded-full blur-2xl group-hover:bg-[#A7D189]/10 transition-colors"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase tracking-widest print:text-gray-500">Diselamatkan</p>
                            <p className="text-4xl font-black text-white print:text-[#1A361D]">171 <span className="text-lg text-gray-500">kg</span></p>
                        </div>
                        <div className="bg-[#A7D189]/10 p-3 rounded-[16px] border border-[#A7D189]/20 text-[#A7D189] print:bg-green-100 print:text-green-700">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-[#A7D189] font-bold mt-4 flex items-center gap-1 relative z-10 print:text-green-600">+14% dari minggu lalu</p>
                </div>

                <div className="bg-[#1C1C24] p-6 rounded-[28px] shadow-lg border border-white/5 print:shadow-none print:border-gray-300 print:bg-gray-50 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-colors"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase tracking-widest print:text-gray-500">Total Terbuang</p>
                            <p className="text-4xl font-black text-white print:text-red-600">15 <span className="text-lg text-gray-500">kg</span></p>
                        </div>
                        <div className="bg-red-500/10 p-3 rounded-[16px] border border-red-500/20 text-red-500 print:bg-red-100 print:text-red-600">
                            <TrendingDown size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-green-400 font-bold mt-4 flex items-center gap-1 relative z-10 print:text-green-600">-40% dari minggu lalu (Membaik)</p>
                </div>
            </div>

            {/* Area Grafik (Focal Point Putih Terang seperti di Dashboard) */}
            <div className="bg-white p-8 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] print:shadow-none print:border-gray-300 mt-4 relative group hover:shadow-[0_20px_50px_rgba(167,209,137,0.15)] transition-all duration-500">
                <h3 className="text-lg font-black text-[#13131A] mb-8 uppercase tracking-wide flex items-center gap-2"><BarChart3 size={24} className="text-[#A7D189]" /> Efisiensi 7 Hari Terakhir</h3>
                <div className="w-full h-[320px] flex justify-center">
                    <Bar options={chartOptions} data={chartData} />
                </div>
            </div>

        </div>
    );
};

export default LaporanStatistik;