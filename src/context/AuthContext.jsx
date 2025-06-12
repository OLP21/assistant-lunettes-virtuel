// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api, { setAuthToken } from '../api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for a token & fetch profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      api.get('/auth/profile')
         .then(res => setUser(res.data))
         .catch(() => logout());
    }
    setLoading(false);
  }, []);

  function register({ username, email, password }) {
    return api.post('/auth/register', { username, email, password });
  }

  function login({ email, password }) {
    return api.post('/auth/login', { email, password })
      .then(res => {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        setAuthToken(token);
        setUser(user);
      });
  }

  function logout() {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access auth
export const useAuth = () => useContext(AuthContext);
