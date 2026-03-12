const csrf = require('express-csurf');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('../models');
const logger = require('../config/logger');

// ===== DÉTECTION ENVIRONNEMENT =====
const isProduction = process.env.NODE_ENV === 'production';

// ===== VALIDATION DU SECRET EN PRODUCTION =====
if (isProduction && !process.env.SESSION_SECRET) {
    throw new Error('ERREUR SÉCURITÉ: SESSION_SECRET doit être défini en production');
}

if (!process.env.SESSION_SECRET && !isProduction) {
    logger.warn('SESSION_SECRET non defini - utilisation d\'un secret par defaut (DEV UNIQUEMENT)');
}

// ===== SESSION STORE : Sequelize en PROD, Mémoire en DEV =====
const sessionStore = isProduction 
    ? new SequelizeStore({ 
        db: sequelize, 
        tableName: 'sessions',
        checkExpirationInterval: 15 * 60 * 1000, // Nettoyage toutes les 15 min
        expiration: 24 * 60 * 60 * 1000 // 24 heures
      })
    : undefined; // Mémoire en dev

if (isProduction && sessionStore) {
    sessionStore.sync(); // Créer la table sessions si elle n'existe pas
}

// ===== SESSION CONFIGURATION =====
const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-prod',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProduction, // HTTPS uniquement en production
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    },
    ...(isProduction && { store: sessionStore }) // Ajouter store uniquement en prod
};

const sessionMiddleware = session(sessionConfig);

// ===== CSRF PROTECTION =====
const csrfProtection = csrf({
    cookie: false  // Utilise la session, pas les cookies
});

logger.info(`CSRF configure - Mode: ${isProduction ? 'PRODUCTION (MySQL)' : 'DEV (Memoire)'}`);

module.exports = {
    sessionMiddleware,
    csrfProtection
};
