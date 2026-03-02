const csrf = require('express-csurf');
const session = require('express-session');

// ===== SESSION CONFIGURATION =====
const sessionConfig = session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-prod',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS en production
        sameSite: 'Strict',
        maxAge: 1000 * 60 * 60 * 24 // 24 heures
    }
});

// ===== CSRF PROTECTION =====
const csrfProtection = csrf({
    cookie: false  // Utilise la session, pas les cookies
});

module.exports = {
    sessionConfig,
    csrfProtection
};
