import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EcoBot from './components/EcoBot';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AIDetect from './pages/AIDetect';
import SmartBins from './pages/SmartBins';
import ReportIssue from './pages/ReportIssue';
import Rewards from './pages/Rewards';
import Education from './pages/Education';
import Analytics from './pages/Analytics';
import Collection from './pages/Collection';
import NearbyCenters from './pages/NearbyCenters';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading EcoSort AI...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/education" element={<Education />} />

              {/* Protected Citizen Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/ai-detect" element={<ProtectedRoute><AIDetect /></ProtectedRoute>} />
              <Route path="/bins" element={<ProtectedRoute><SmartBins /></ProtectedRoute>} />
              <Route path="/complaints" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
              <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/collection" element={<ProtectedRoute><Collection /></ProtectedRoute>} />
              <Route path="/centers" element={<ProtectedRoute><NearbyCenters /></ProtectedRoute>} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>
          </main>
          <EcoBot />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
