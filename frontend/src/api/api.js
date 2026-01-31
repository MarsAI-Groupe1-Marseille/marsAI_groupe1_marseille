import axios from 'axios';

const api = axios.create({
    // On récupère l'URL de ton .env
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000, // Si le serveur ne répond pas après 5s, on arrête
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;