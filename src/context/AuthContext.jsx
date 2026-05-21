import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async (email, password) => {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    if (!email.includes('@') || !email.includes('.')) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    setUser({
      name: 'Martin de Weerdt',
      role: 'Global Chief Information Officer',
      avatarInitials: 'MD',
      email,
    });
    setIsAuthenticated(true);

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}