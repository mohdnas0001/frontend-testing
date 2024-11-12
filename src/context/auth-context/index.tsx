// context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { login as loginApi } from '../../api/auth/index'; 
import useAuthStore from '../../hooks/useAuthStore';


interface AuthContextType {
  accessToken: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
    const setUsername = useAuthStore((state) => state.setUsername); // Access the setUsername function from the store


  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Call the login API function defined elsewhere (e.g., apiClient-based)
      const response = await loginApi({ username: email, password });

      if (response.data && response.data.accessToken && response.data.user) {
        const token = response.data.accessToken;
        setAccessToken(token);
          localStorage.setItem('accessToken', token);
       setUsername(response.data.user.username); 

        return true;
      } else {
        console.error('Login failed: No token received');
        return false;
      }
    } catch (error) {
      console.error('Error logging in:', error);
    throw error;
    }
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
  };

  useEffect(() => {
    // Additional logic like token validation can go here if needed
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
