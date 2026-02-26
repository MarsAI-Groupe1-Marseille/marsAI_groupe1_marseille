// config/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // Assure-toi que c'est le bon port !
  withCredentials: true
});

export default instance;