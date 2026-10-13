import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('farmassist_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('farmassist_token');
      const storedUser = localStorage.getItem('farmassist_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data.success) {
        const authData = res.data.data;
        setToken(authData.token);
        setUser(authData);
        localStorage.setItem('farmassist_token', authData.token);
        localStorage.setItem('farmassist_user', JSON.stringify(authData));
        return { success: true, data: authData };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: msg };
    }
  };

  const register = async (formData) => {
    try {
      const res = await apiClient.post('/auth/register', formData);
      if (res.data.success) {
        const authData = res.data.data;
        setToken(authData.token);
        setUser(authData);
        localStorage.setItem('farmassist_token', authData.token);
        localStorage.setItem('farmassist_user', JSON.stringify(authData));
        return { success: true, data: authData };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('farmassist_token');
    localStorage.removeItem('farmassist_user');
  };

  const quickDemoLogin = async (roleType) => {
    let credentials = { email: 'ramesh.patel@kisan.in', password: 'farmer123' };
    if (roleType === 'PROVIDER') {
      credentials = { email: 'kisan.agro@services.in', password: 'provider123' };
    } else if (roleType === 'ADMIN') {
      credentials = { email: 'admin@farmassist.com', password: 'admin123' };
    }
    return await login(credentials.email, credentials.password);
  };

  const updateUserProfile = (updatedProfile) => {
    if (user) {
      const newUser = { ...user, profile: updatedProfile };
      setUser(newUser);
      localStorage.setItem('farmassist_user', JSON.stringify(newUser));
    }
  };

  const isFarmer = user?.role === 'ROLE_FARMER';
  const isProvider = user?.role === 'ROLE_PROVIDER';
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
        updateUserProfile,
        isFarmer,
        isProvider,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
