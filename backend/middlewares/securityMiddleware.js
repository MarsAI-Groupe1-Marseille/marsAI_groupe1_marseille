const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// ===== RATE LIMITERS =====

// Handler personnalisé pour formater les erreurs du rate limiter en JSON
const rateLimitHandler = (req, res) => {
    return res.status(429).json({
        success: false,
        message: 'Trop de requêtes, réessayez dans 15 minutes.',
        error: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000) // Temps en secondes
    });
};

// Limiteur GÉNÉRAL : 500 requêtes par 15 minutes par IP (très permissif, anti-abus basique)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500,                   // 500 requêtes max par IP (permissif pour éviter bloquer 2 jurés sur même réseau)
    handler: rateLimitHandler,  // Utiliser notre handler personnalisé
    standardHeaders: true,      // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,       // Disable the `X-RateLimit-*` headers
    skip: (req) => {
        // Les administrateurs et routes publiques légitimes ne sont pas limités
        return req.user && req.user.role === 'admin';
    }
});

// Limiteur STRICT LOGIN : 5 tentatives par 15 minutes PAR IP
const strictLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
            error: 'RATE_LIMIT_LOGIN'
        });
    },
    skipSuccessfulRequests: true, // Ne compte que les erreurs
    standardHeaders: true,
    legacyHeaders: false
});

// Limiteur FORGOT PASSWORD : 3 tentatives par 1 heure
const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 3,
    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: 'Trop de demandes. Réessayez dans 1 heure.',
            error: 'RATE_LIMIT_FORGOT_PASSWORD'
        });
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Limiteur UPLOADS : 10 uploads par heure
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: 'Trop d\'uploads. Réessayez dans 1 heure.',
            error: 'RATE_LIMIT_UPLOAD'
        });
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Limiteur AUTHENTIFIÉ : 200 requêtes par 15 minutes PAR IP
// Pour les routes protégées (/api/jury/*, /api/admin/*, /api/users/*, /api/submissions/*)
// Limit plus élevée que le general limiter car ces routes concernent les utilisateurs authentifiés
// Chaque utilisateur a sa propre session/authentification même s'ils partagent une IP
const authenticatedLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: 'Trop de requêtes. Vous avez atteint la limite. Réessayez dans 15 minutes.',
            error: 'RATE_LIMIT_AUTH_EXCEEDED'
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Les administrateurs ne sont pas limités
        return req.user && req.user.role === 'admin';
    }
});

// ===== HELMET CONFIGURATION =====
const helmetConfig = helmet({
    // Désactiver CSP en développement (trop restrictif pour debug)
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imageSrc: [
                "'self'",
                "http://localhost:3000",
                "data:",
                "https:",
                "blob:"
            ],
            connectSrc: ["'self'", "http://localhost:3000", "https://www.googleapis.com", "https://accounts.google.com"],
            fontSrc: ["'self'", "data:"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    } : false,  // Désactivé en dev
    
    // Désactiver HSTS en développement
    hsts: process.env.NODE_ENV === 'production' ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    } : false,
    
    // IMPORTANT: Autoriser le chargement cross-origin des ressources
    crossOriginResourcePolicy: { policy: "cross-origin" },
    
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
    authenticatedLimiter,
    helmetConfig
};
