import React from 'react';
import { Download, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const LaporanStatistik = () => {
    const navigate = useNavigate();

    const handleDownloadPDF = () => {
        window.print();
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    const chartData = {
        labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
        datasets: [
            {
                label: 'Bahan Diselamatkan (kg)',
                data: [12, 19, 15, 22, 28, 35, 40],
                backgroundColor: '#A7D189', 
                borderRadius: 4,
            },
            {
                label: 'Bahan Terbuang (kg)',
                data: [5, 2, 4, 1, 0, 2, 1],
                backgroundColor: '#EF4444', 
                borderRadius: 4,
            },
        ],
    };

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto pb-10 print:bg-white print:p-0">

            {/* Header Halaman */}
            <div className="flex items-center justify-between mb-6 print:hidden">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                        <ArrowLeft size={20} className="text-gray-700" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Laporan & Statistik</h2>
                </div>

                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 bg-[#0B1528] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-md"
                >
                    <Download size={16} />
                    Unduh PDF
                </button>
            </div>

            {/* Judul Dokumen */}
            <div className="hidden print:block text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Laporan Food Waste UMKM</h1>
                <p className="text-gray-500">Periode: Minggu Terakhir</p>
                <hr className="mt-4 border-gray-300" />
            </div>

            {/* Ringkasan Angka */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 print:shadow-none print:border-gray-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Total Diselamatkan</p>
                            <p className="text-3xl font-bold text-[#1A361D]">171 kg</p>
                        </div>
                        <div className="bg-green-50 p-2 rounded-lg text-green-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-green-600 font-medium mt-3 flex items-center gap-1">
                        +14% dari minggu lalu
                    </p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 print:shadow-none print:border-gray-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Total Terbuang</p>
                            <p className="text-3xl font-bold text-red-600">15 kg</p>
                        </div>
                        <div className="bg-red-50 p-2 rounded-lg text-red-500">
                            <TrendingDown size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-green-600 font-medium mt-3 flex items-center gap-1">
                        -40% dari minggu lalu (Membaik)
                    </p>
                </div>
            </div>

            {/* Area Grafik Chart.js (SELALU MUNCUL PERMANEN) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:shadow-none print:border-gray-300">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Grafik Efisiensi Inventaris (7 Hari Terakhir)</h3>
                <div className="w-full h-[300px] flex justify-center">
                    <Bar options={chartOptions} data={chartData} />
                </div>
            </div>

        </div>
    );
};

export default LaporanStatistik;