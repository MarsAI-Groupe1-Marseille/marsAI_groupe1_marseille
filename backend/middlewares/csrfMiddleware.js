const csrf = require('express-csurf');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('../models');

// ===== DÉTECTION ENVIRONNEMENT =====
const isProduction = process.env.NODE_ENV === 'production';

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

console.log(`CSRF configuré - Mode: ${isProduction ? 'PRODUCTION (MySQL)' : 'DEV (Mémoire)'}`);

module.exports = {
    sessionMiddleware,
    csrfProtection
};
