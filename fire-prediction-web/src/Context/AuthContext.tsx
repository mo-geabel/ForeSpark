import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('fireforest_token');
      console.log(token);
      
      if (token) {
        try {
          // Verify token with backend and get user details
          const response = await fetch('http://localhost:5000/api/auth/user', {
            headers: { 'x-auth-token': token }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData); // This restores the user session
          } else {
            localStorage.removeItem('fireforest_token'); // Token was invalid/expired
          }
        } catch (error) {
          console.error("Auth check failed", error);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('fireforest_token');
    setUser(null);
    window.location.href = '/'; // Optional: Send user back to landing page
  };

  return (
    <AuthContext.Provider value={{ 
      // isAuthenticated is true if there is a token AND a user loaded
      isAuthenticated: !!localStorage.getItem('fireforest_token') && !!user, 
      user, 
      loading, 
      login, 
      logout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);