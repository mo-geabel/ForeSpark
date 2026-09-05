import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Component/Home';
import MapSelector from './Component/MapSelector';
import AuthModal from './Component/Auth';
import { AuthProvider, useAuth } from './Context/AuthContext'; 
import History from './Component/History';
import Documentation from './Component/Documentation';
import AnalysisPage from './Component/AnalysisPage';
import Presentation from './Component/Presentation';
import AdminPanel from './Component/AdminPanel';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Admin Protected Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (user?.role !== 'admin') return <Navigate to="/app" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Clerk SSO Redirect Handler */}
          <Route 
            path="/sso-callback" 
            element={
              <AuthenticateWithRedirectCallback 
                signInForceRedirectUrl="/app"
                signUpForceRedirectUrl="/app"
                signInFallbackRedirectUrl="/app"
                signUpFallbackRedirectUrl="/app"
              />
            } 
          />

          {/* Landing Page */}
          <Route path="/" element={<Home onStart={() => {}} />} />
          
          {/* Documentation Page */}
          <Route path="/documentation" element={<Documentation />} />
          
          {/* Presentation Page */}
          <Route path="/presentation" element={<Presentation />} />
          
          {/* Auth Page */}
          <Route path="/auth" element={<AuthModal isOpen={true} onClose={() => {}} initialMode="login" />} />
          <Route path="/register" element={<AuthModal isOpen={true} onClose={() => {}} initialMode="register" />} />
          
          {/* Protected Map/Analysis Tool */}
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <MapSelector />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analysis/:id" 
            element={
              <ProtectedRoute>
                <AnalysisPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;