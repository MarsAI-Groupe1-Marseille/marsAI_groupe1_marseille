import axios from 'axios';

// Configuration globale d'axios pour les cookies
axios.defaults.baseURL = 'http://localhost:3000/api';
axios.defaults.withCredentials = true; // Envoyer les cookies avec chaque requête

export default axios;
