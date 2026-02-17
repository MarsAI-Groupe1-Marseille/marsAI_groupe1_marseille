import axios from 'axios';

// Configuration globale d'axios pour les cookies
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
axios.defaults.baseURL = `${apiUrl}/api`;
axios.defaults.withCredentials = true; // Envoyer les cookies avec chaque requête

export default axios;
