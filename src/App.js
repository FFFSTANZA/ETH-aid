import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import DonorDashboard from './components/DonorDashboard';
import DistributorDashboard from './components/DistributorDashboard';
import AidReceiverDashboard from './components/AidReceiverDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/donor" element={<DonorDashboard />} />
        <Route path="/distributor" element={<DistributorDashboard />} />
        <Route path="/recipient" element={<AidReceiverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
