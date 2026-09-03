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

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

// Admin Protected Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
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