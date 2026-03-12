// utils/errorHandler.js
// Helper pour gérer les erreurs de manière sécurisée
const logger = require('../config/logger');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Formate une erreur de manière sécurisée
 * En production : message générique
 * En développement : message détaillé pour debug
 * 
 * @param {Error} error - L'erreur capturée
 * @param {string} fallbackMessage - Message générique à afficher en production
 * @returns {Object} - Objet d'erreur sécurisé
 */
const formatError = (error, fallbackMessage = 'Une erreur est survenue.') => {
    if (isProduction) {
        // En production : message générique seulement
        return {
            error: fallbackMessage
        };
    } else {
        // En développement : détails complets pour debug
        return {
            error: fallbackMessage,
            details: error.message,
            stack: error.stack
        };
    }
};

/**
 * Envoie une réponse d'erreur sécurisée
 * 
 * @param {Object} res - Objet response Express
 * @param {number} statusCode - Code HTTP (400, 500, etc.)
 * @param {Error} error - L'erreur capturée
 * @param {string} fallbackMessage - Message générique
 */
const sendErrorResponse = (res, statusCode, error, fallbackMessage = 'Une erreur est survenue.') => {
    // Log l'erreur côté serveur (toujours, même en prod)
    logger.error(`[ERROR ${statusCode}] ${error.message}`, {
        statusCode,
        stack: error.stack
    });
    
    return res.status(statusCode).json(formatError(error, fallbackMessage));
};

/**
 * Log les erreurs de sécurité (tentatives suspectes)
 * 
 * @param {string} type - Type d'alerte (LOGIN_FAILED, INVALID_TOKEN, etc.)
 * @param {Object} details - Détails de l'incident
 */
const logSecurityEvent = (type, details) => {
    const timestamp = new Date().toISOString();
    logger.warn(`[SECURITY ${timestamp}] ${type}`, { details });
    
    // TODO: En production, envoyer vers un système de monitoring (Sentry, Datadog, etc.)
};

module.exports = {
    formatError,
    sendErrorResponse,
    logSecurityEvent
};
