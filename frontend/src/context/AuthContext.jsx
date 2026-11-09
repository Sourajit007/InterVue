import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockCurrentUser } from '../data/mockData';
import { apiLogin, apiRegister } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('intervue_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('intervue_token') || null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user && !!token);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('intervue_user', JSON.stringify(user));
      localStorage.setItem('intervue_token', token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('intervue_user');
      localStorage.removeItem('intervue_token');
      setIsAuthenticated(false);
    }
  }, [user, token]);

  const login = async (email, password) => {
    try {
      // Attempt backend API login
      const response = await apiLogin(email, password);
      if (response?.user && response?.token) {
        const loggedUser = {
          ...response.user,
          avatar: response.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        };
        setUser(loggedUser);
        setToken(response.token);
        return { success: true, user: loggedUser };
      }
      return { success: false, message: response?.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (name, email, password, targetRole) => {
    try {
      // Attempt backend API registration
      const response = await apiRegister({ name, email, password, targetRole });
      if (response?.user && response?.token) {
        const newUser = {
          ...response.user,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          experienceLevel: '3+ Years',
          totalInterviews: 0,
          hoursPracticed: 0,
          atsAverage: 80,
          streakDays: 1,
        };
        setUser(newUser);
        setToken(response.token);
        return { success: true, user: newUser };
      }
      return { success: false, message: response?.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('intervue_user');
    localStorage.removeItem('intervue_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
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
