import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust to your backend port
  withCredentials: true, // IMPORTANT: Allows cookies to be sent/received
});

export default api;