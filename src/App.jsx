import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import BriefingPagi from './pages/BriefingPagi/BriefingPagi';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Rute yang dibungkus oleh MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/briefing" element={<BriefingPagi />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;