import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(API_URL + '/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(API_URL + '/auth/login', {
        email,
        password
      });
      
      const token = response.data.token;
      const user = response.data.user;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      setToken(token);
      setUser(user);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      const response = await axios.post(API_URL + '/auth/signup', {
        name,
        email,
        password,
        role
      });
      
      const token = response.data.token;
      const user = response.data.user;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      setToken(token);
      setUser(user);
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAdmin: user?.role === 'Admin'
  };

  return React.createElement(AuthContext.Provider, { value: value }, children);
};
