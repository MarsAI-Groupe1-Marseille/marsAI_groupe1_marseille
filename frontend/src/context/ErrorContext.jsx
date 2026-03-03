import { createContext, useContext, useState } from 'react';

const ErrorContext = createContext();

/**
 * Provider pour gérer les erreurs globales de l'application
 */
export const ErrorProvider = ({ children }) => {
    const [errors, setErrors] = useState([]);

    /**
     * Ajoute une erreur avec un ID unique
     * @param {string} message - Le message d'erreur
     * @param {string} type - Le type d'erreur (error, warning, info, success)
     * @param {number} duration - La durée avant suppression en ms (0 = manuel)
     */
    const addError = (message, type = 'error', duration = 5000) => {
        const id = Date.now();
        const error = { id, message, type };
        
        setErrors(prev => [...prev, error]);

        if (duration > 0) {
            setTimeout(() => {
                removeError(id);
            }, duration);
        }

        return id;
    };

    /**
     * Supprime une erreur par ID
     */
    const removeError = (id) => {
        setErrors(prev => prev.filter(error => error.id !== id));
    };

    /**
     * Vide toutes les erreurs
     */
    const clearErrors = () => {
        setErrors([]);
    };

    /**
     * Ajoute une erreur axios automatiquement formatée
     */
    const addAxiosError = (error) => {
        let message = 'Une erreur est survenue';
        let type = 'error';

        if (error.response) {
            // Le serveur a répondu avec un code d'erreur
            if (error.response.data?.message) {
                message = error.response.data.message;
            } else if (error.response.status === 429) {
                message = 'Trop de requêtes. Veuillez réessayer plus tard.';
            } else if (error.response.status === 403) {
                message = 'Accès refusé';
            } else if (error.response.status === 404) {
                message = 'Ressource non trouvée';
            } else if (error.response.status >= 500) {
                message = 'Erreur serveur. Veuillez réessayer plus tard.';
            }
        } else if (error.request) {
            // La requête a été faite mais pas de réponse
            message = 'Impossible de se connecter au serveur';
        } else {
            // Erreur lors de la configuration de la requête
            message = error.message || message;
        }

        return addError(message, type);
    };

    const value = {
        errors,
        addError,
        removeError,
        clearErrors,
        addAxiosError
    };

    return (
        <ErrorContext.Provider value={value}>
            {children}
        </ErrorContext.Provider>
    );
};

/**
 * Hook pour utiliser le contexte d'erreurs
 */
export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError doit être utilisé dans un ErrorProvider');
    }
    return context;
};
