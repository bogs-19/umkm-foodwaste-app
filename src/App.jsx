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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Rute yang dibungkus oleh MainLayout */}
        <Route element={<MainLayout />}>
          {/* Rute lama... */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/briefing" element={<BriefingPagi />} />

          {/* Rute Baru yang sudah dikoreksi */}
          <Route path="/daftar-bahan" element={<DaftarBahan />} />
          <Route path="/promo" element={<RiwayatAksi />} />
          <Route path="/donasi" element={<KatalogDonasi />} />
          <Route path="/statistik" element={<LaporanStatistik />} />
          <Route path="/eksekusi-promo" element={<EksekusiPromo />} />
          <Route path="/settings" element={<AccountSetting />} />
          <Route path="/bahan/:id" element={<DetailBahan />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;