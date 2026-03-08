import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../config/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer l'user depuis localStorage au montage
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setLoading(false);
          return;
        } catch (error) {
          console.error('Erreur parsing user:', error);
          localStorage.removeItem('user');
        }
      }

      try {
        const response = await axios.get('/auth/me');
        if (response?.data) {
          localStorage.setItem('user', JSON.stringify(response.data));
          setUser(response.data);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Écouter les changements d'avatar depuis d'autres composants
    const handleAvatarUpdate = (event) => {
      console.log('🎯 EVENT RECEIVED in AuthContext:', event.detail);
      const updatedUser = event.detail;
      if (updatedUser) {
        console.log('📝 Saving to localStorage:', updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        console.log('✅ User state updated in AuthContext');
      }
    };

    window.addEventListener('userAvatarUpdated', handleAvatarUpdate);
    return () => {
      window.removeEventListener('userAvatarUpdated', handleAvatarUpdate);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { user } = response.data;
      
      // Stocker l'user dans localStorage ET state
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Appeler l'endpoint de déconnexion du backend
      await axios.post('/auth/logout');
      
      // Nettoyer le user
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Erreur logout:', error);
      // Nettoyer même en cas d'erreur
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook custom directement dans le Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider');
  }
  return context;
};
