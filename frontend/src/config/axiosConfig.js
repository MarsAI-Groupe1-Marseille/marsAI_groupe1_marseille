import axios from 'axios';

// Configuration globale d'axios pour les cookies
axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:3000/api';
axios.defaults.withCredentials = true; // Envoyer les cookies avec chaque requête

export default axios;
