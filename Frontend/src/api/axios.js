import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`, // Adjust to your backend port
  withCredentials: true, // IMPORTANT: Allows cookies to be sent/received
});

export default api;