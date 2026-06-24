import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import BriefingPagi from './pages/BriefingPagi/BriefingPagi';
import EksekusiPromo from './pages/Aksi/EksekusiPromo';
import LaporanStatistik from './pages/Statistik/LaporanStatistik';
import DaftarBahan from './pages/Bahan/DaftarBahan';
import RiwayatAksi from './pages/Aksi/RiwayatAksi';
import KatalogDonasi from './pages/Aksi/KatalogDonasi';
import AccountSetting from './pages/Settings/AccountSetting';
import DetailBahan from './pages/Bahan/DetailBahan';
import BarangRestock from './pages/Bahan/BarangRestock';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Semua Rute di Bawah Ini Dibungkus MainLayout (TopBar & Navigasi) */}
        <Route element={<MainLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/briefing" element={<BriefingPagi />} />

          {/* Rute Manajemen Bahan */}
          <Route path="/daftar-bahan" element={<DaftarBahan />} />
          <Route path="/restock" element={<BarangRestock />} />
          <Route path="/bahan/:id" element={<DetailBahan />} />

          {/* RUTE PROMO YANG SUDAH DIPERBAIKI (TIDAK ADA DUPLIKAT LAGI) */}
          <Route path="/riwayat-promo" element={<RiwayatAksi />} /> {/* Tampilan Riwayat (Jika masih dipakai) */}

          {/* Ini adalah file EksekusiPromo.jsx yang punya 2 mode (List & Editor) */}
          <Route path="/promo" element={<EksekusiPromo />} />
          <Route path="/promo/:id" element={<EksekusiPromo />} />

          {/* Rute Lainnya */}
          <Route path="/donasi" element={<KatalogDonasi />} />
          <Route path="/statistik" element={<LaporanStatistik />} />
          <Route path="/settings" element={<AccountSetting />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;