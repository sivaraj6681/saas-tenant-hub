// src/services/authService.js
import axios from 'axios';

export const login = async (email, password) => {
  const res = await axios.post('http://localhost:5000/api/auth/login', {
    email,
    password
  });
  return res.data; // { token }
};

export const register = async (formData) => {
  const res = await axios.post('http://localhost:5000/api/auth/register', formData);
  return res.data;
};
