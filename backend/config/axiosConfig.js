// config/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.BACKEND_API_URL || `${process.env.BACKEND_URL || 'http://localhost:3000'}/api`,
  withCredentials: true
});

export default instance;