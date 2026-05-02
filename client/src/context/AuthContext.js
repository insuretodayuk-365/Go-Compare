import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Load user
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      api.get('/api/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // 🔑 LOGIN
  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });

    const { token, user } = res.data;

    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);

    return res.data;
  };

  // 📝 REGISTER
  const register = async (firstName, lastName, email, password) => {
    const res = await api.post('/api/auth/register', {
      firstName,
      lastName,
      email,
      password,
    });

    const { token, user } = res.data;

    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);

    return res.data;
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);