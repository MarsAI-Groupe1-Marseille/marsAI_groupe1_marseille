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
export const fetchCSRFToken = async () => {
	try {
		const response = await axios.get('/csrf-token', {
			// Ne pas ajouter le token CSRF pour cette requête GET
			headers: { 'X-CSRF-Token': '' }
		});
		csrfToken = response.data.csrfToken;
		console.log('Token CSRF récupéré');
		return csrfToken;
	} catch (error) {
		console.error('Erreur récupération token CSRF:', error);
		return null;
	}
};

export const getCSRFToken = () => csrfToken;
export const clearCSRFToken = () => { 
	csrfToken = null;
	console.log('Token CSRF effacé');
};

// Interceptor pour ajouter le token CSRF aux requêtes mutations (POST, PUT, DELETE)
axios.interceptors.request.use(async (config) => {
	// Pour les requêtes GET et HEAD, pas besoin de CSRF token
	if (config.method === 'get' || config.method === 'head') {
		return config;
	}
	
	// Pour les requêtes mutations (POST, PUT, DELETE, PATCH)
	if (!csrfToken) {
		await fetchCSRFToken();
	}
	if (csrfToken) {
		config.headers['X-CSRF-Token'] = csrfToken;
	}
	
	return config;
}, (error) => {
	return Promise.reject(error);
});

// Interceptor de réponse : auto-récupération sur erreur CSRF 403
axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		
		// Si erreur 403 CSRF et pas déjà retenté
		if (error.response?.status === 403 && 
			error.response?.data?.code === 'CSRF_INVALID' && 
			!originalRequest._retry) {
			
			console.warn('Token CSRF invalide, récupération automatique...');
			originalRequest._retry = true;
			clearCSRFToken();
			
			try {
				await fetchCSRFToken();
				originalRequest.headers['X-CSRF-Token'] = csrfToken;
				console.log('Nouvelle tentative avec token rafraîchi');
				return axios(originalRequest);
			} catch (retryError) {
				console.error('Échec récupération token:', retryError);
				return Promise.reject(retryError);
			}
		}
		
		return Promise.reject(error);
	}
);

export default axios;
