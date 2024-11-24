import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { LoginForm } from '../models/Login';
import { User } from '../models/User';
import { AuthContextType } from '../models/AuthContextType';

export const identifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"; 
export const urlAuth = 'http://localhost:5067/api/auth/login';

const defaultAuthContext: AuthContextType = {
  user: null,
  login: async () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log('Decoded token:', decoded); // Log para ver el token decodificado
        const userId = decoded[identifier];
        console.log('Extracted userId:', userId); // Log para ver el userId extraído
        const userWithId = { ...decoded, id: userId };
        setUser(userWithId);
      } catch (error) {
        console.error('Error decoding token from localStorage:', error);
      }
    }
  }, []);

  const login = async (data: LoginForm) => {
    try {
      const response = await axios.post(urlAuth, data);
      const { token } = response.data;

      if (typeof token === 'string') {
        localStorage.setItem('token', token);
        console.log('Token set in localStorage:', token);
        const decoded: any = jwtDecode(token);
        console.log('Decoded token after login:', decoded); // Log para ver el token decodificado después de iniciar sesión
        const userId = decoded[identifier];
        console.log('Extracted userId after login:', userId); // Log para ver el userId extraído después de iniciar sesión
        const userWithId = { ...decoded, id: userId };
        setUser(userWithId);
      } else {
        console.error('Token is not a valid string:', token);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
