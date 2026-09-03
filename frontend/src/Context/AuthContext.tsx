import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-react';

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
  const { isSignedIn, getToken, signOut, isLoaded: isClerkLoaded } = useClerkAuth();
  const { user: clerkUser } = useClerkUser();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync Clerk authentication
  useEffect(() => {
    const syncClerk = async () => {
      if (!isClerkLoaded) return;

      if (isSignedIn && clerkUser) {
        try {
          const token = await getToken();
          if (token) {
            localStorage.setItem('fireforest_token', token);
          }
          const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress || '';
          const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.username || 'User';

          let fetchedRole = 'user';
          let fetchedId = clerkUser.id;

          if (token) {
            try {
              const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
              const response = await fetch(`${API_URL}/api/auth/user`, {
                headers: {
                  'x-auth-token': token,
                  'Authorization': `Bearer ${token}`,
                  'x-user-email': primaryEmail
                }
              });

              if (response.ok) {
                const userData = await response.json();
                if (userData) {
                  if (userData.role) fetchedRole = userData.role;
                  if (userData._id || userData.id) fetchedId = userData._id || userData.id;
                }
              }
            } catch (err) {
              console.error("Failed to fetch user role from backend", err);
            }
          }

          setUser({
            id: fetchedId,
            fullName,
            email: primaryEmail,
            role: fetchedRole,
          });
        } catch (err) {
          console.error("Clerk token sync failed", err);
        }
      } else {
        // Fallback to legacy JWT token check
        const token = localStorage.getItem('fireforest_token');
        if (token) {
          try {
            const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
            const response = await fetch(`${API_URL}/api/auth/user`, {
              headers: { 
                'x-auth-token': token,
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.ok) {
              const userData = await response.json();
              setUser({
                id: userData._id || userData.id,
                fullName: userData.fullName,
                email: userData.email,
                role: userData.role || 'user',
              });
            } else {
              localStorage.removeItem('fireforest_token');
            }
          } catch (error) {
            console.error("Auth check failed", error);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    };

    syncClerk();
  }, [isSignedIn, clerkUser, isClerkLoaded]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    if (isSignedIn) {
      await signOut();
    }
    localStorage.removeItem('fireforest_token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!user, 
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