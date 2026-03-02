const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// ===== RATE LIMITERS =====

// Limiteur GÉNÉRAL : 100 requêtes par 15 minutes pour toutes les routes
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                   // 100 requêtes max par IP
    message: 'Trop de requêtes, réessayez dans 15 minutes.',
    standardHeaders: true,      // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,       // Disable the `X-RateLimit-*` headers
    skip: (req) => {
        // Les administrateurs ne sont pas limités
        return req.user && req.user.role === 'admin';
    }
});

// Limiteur STRICT LOGIN : 5 tentatives par 15 minutes
const strictLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
    skipSuccessfulRequests: true, // Ne compte que les erreurs
    standardHeaders: true,
    legacyHeaders: false
});

// Limiteur FORGOT PASSWORD : 3 tentatives par 1 heure
const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 3,
    message: 'Trop de demandes. Réessayez dans 1 heure.',
    standardHeaders: true,
    legacyHeaders: false
});

// Limiteur UPLOADS : 10 uploads par heure
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: 'Trop d\'uploads. Réessayez dans 1 heure.',
    standardHeaders: true,
    legacyHeaders: false
});

// ===== HELMET CONFIGURATION =====
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imageSrc: ["'self'", "data:", "https://"],
            connectSrc: ["'self'", "https://www.googleapis.com", "https://accounts.google.com"],
            fontSrc: ["'self'", "data:"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    hsts: {
        maxAge: 31536000, // 1 an
        includeSubDomains: true,
        preload: true
    },
    frameguard: {
        action: 'deny'
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    }
});

module.exports = {
    generalLimiter,
    strictLoginLimiter,
    forgotPasswordLimiter,
    uploadLimiter,
    helmetConfig
};
