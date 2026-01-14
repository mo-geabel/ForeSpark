import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Component/Home';
import MapSelector from './Component/MapSelector';
import AuthModal from './Component/Auth';
import { AuthProvider, useAuth } from './Context/AuthContext'; 
import History from './Component/History';
import Documentation from './Component/Documentation';
import AnalysisPage from './Component/AnalysisPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;