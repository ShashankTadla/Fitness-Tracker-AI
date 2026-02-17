import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerUser = (formData) => API.post('/auth/register', formData);
export const loginUser = (formData) => API.post('/auth/login', formData);
export const getProfile = () => API.get('/auth/profile');

export const logWater = (data) => API.post('/water/log', data);
export const logCalorie = (data) => API.post('/calorie/log', data);
export const logSleep = (data) => API.post('/sleep/log', data);

export const getBackendStatus = () => axios.get('http://localhost:5000/');
