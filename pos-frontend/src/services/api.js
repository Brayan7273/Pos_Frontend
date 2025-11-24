import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Cambia si tu Flask usa otro puerto
});

export default api;
