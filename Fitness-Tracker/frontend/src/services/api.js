import axios from 'axios';

// Base URL for backend API
const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Add token to every request if present
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ Auth endpoints
export const registerUser = (formData) => API.post('/auth/register', formData);
export const loginUser = (formData) => API.post('/auth/login', formData);
export const getProfile = () => API.get('/auth/profile');

// ✅ Logs endpoints
export const logWater = (data) => API.post('/water/log', data);
export const logCalorie = (data) => API.post('/calorie/log', data);
export const logSleep = (data) => API.post('/sleep/log', data);

// ✅ Check backend status (for testing)
export const getBackendStatus = () => axios.get('http://localhost:5000/');
