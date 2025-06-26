// src/services/authService.js
import axios from 'axios';

export const login = async (email, password) => {
  const res = await axios.post('https://saas-tenant-hub-production.up.railway.app/', {
    email,
    password
  });
  return res.data; // { token }
};

export const register = async (formData) => {
  const res = await axios.post('https://saas-tenant-hub-production.up.railway.app/', formData);
  return res.data;
};
