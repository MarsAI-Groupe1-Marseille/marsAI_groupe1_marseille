import axios from 'axios';

// Configuration globale d'axios pour les cookies
const apiBaseUrl = import.meta.env.VITE_API_URL
	? `${import.meta.env.VITE_API_URL}/api`
	: 'http://localhost:3000/api'

axios.defaults.baseURL = apiBaseUrl;
axios.defaults.withCredentials = true; // Envoyer les cookies avec chaque requête

// ===== CSRF TOKEN MANAGEMENT =====
let csrfToken = null;

// Fonction pour récupérer le CSRF token du serveur
const fetchCSRFToken = async () => {
	if (csrfToken) return csrfToken; // Utiliser le token en cache si disponible
	
	try {
		const response = await axios.get('/csrf-token', {
			// Ne pas ajouter le token CSRF pour cette requête GET
			headers: { 'X-CSRF-Token': '' }
		});
		csrfToken = response.data.csrfToken;
		return csrfToken;
	} catch (error) {
		console.error('Erreur lors de la récupération du token CSRF:', error);
		return null;
	}
};

// Interceptor pour ajouter le token CSRF aux requêtes mutations (POST, PUT, DELETE)
axios.interceptors.request.use(async (config) => {
	// Pour les requêtes GET et HEAD, pas besoin de CSRF token
	if (config.method === 'get' || config.method === 'head') {
		return config;
	}
	
	// Pour les requêtes mutations (POST, PUT, DELETE, PATCH)
	const token = await fetchCSRFToken();
	if (token) {
		config.headers['X-CSRF-Token'] = token;
	}
	
	return config;
}, (error) => {
	return Promise.reject(error);
});

export default axios;
