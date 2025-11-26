import axios from 'axios';

// URL de tu backend en Render
const API_URL = 'https://pws-project-cuhm.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 🔥 CRUCIAL para sessions/cookies
  timeout: 15000, // Aumenté el timeout para Render
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para manejar autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Manejar errores específicos
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      // Redirigir a login si no está autenticado
      window.location.href = '/home';
    }
    
    return Promise.reject(error);
  }
);

export default api;