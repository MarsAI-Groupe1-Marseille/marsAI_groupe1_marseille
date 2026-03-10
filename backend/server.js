// backend/server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
require('./config/passport');
const logger = require('./config/logger');

const createDefaultAdmin = require('./utils/createAdmin');

// Import de la connexion Sequelize
const sequelize = require('./config/db');

// Import des middlewares de sécurité
const { helmetConfig, generalLimiter, authenticatedLimiter } = require('./middlewares/securityMiddleware');
const { sessionMiddleware, csrfProtection } = require('./middlewares/csrfMiddleware');
const requestContext = require('./middlewares/requestContext');
const httpLogger = require('./middlewares/httpLogger');

const app = express();
const port = process.env.PORT || 3000;


// Imports des routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const juryRoutes = require('./routes/juryRoutes');
const awardRoutes = require('./routes/awardRoutes');





// ==========================================
// MIDDLEWARES
// ==========================================
app.use(requestContext);

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = (process.env.CORS_ORIGINS || frontendUrl)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Si pas d'origin (requête depuis le serveur), on autorise
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// === MIDDLEWARES DE SÉCURITÉ ===
app.use(helmetConfig);           // Headers de sécurité HTTP
app.use(generalLimiter);         // Rate limiting général (500 req/15min par IP) - permissif pour multi-utilisateurs sur même réseau

// Autorise des payloads plus volumineux (config home avec images base64 avant upload S3)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser()); // Pour parser les cookies
app.use(sessionMiddleware);  // Session pour CSRF
app.use(csrfProtection); // Protection CSRF
app.use(passport.initialize());
app.use(httpLogger);


// ==========================================
// ROUTES
// ==========================================

// Route pour récupérer le token CSRF
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Utilisation des routes préfixées
app.use('/api/auth', authRoutes);         

// Limiter les routes authentifiées par user (évite que 2 jurés sur même réseau se bloquent)
app.use('/api/users', authenticatedLimiter, userRoutes);        
app.use('/api/submissions', authenticatedLimiter, submissionRoutes); 
app.use('/api/admin', authenticatedLimiter, adminRoutes); // Routes admin (validation des films, modération, etc.)
app.use('/api/jury', authenticatedLimiter, juryRoutes); 

// Route publique pour le palmarès
app.use('/api/awards', awardRoutes);

// ...


// Servir les fichiers statiques du dossier uploads avec CORS headers explicites
app.use('/uploads', (req, res, next) => {
    // Ajouter les headers CORS pour les fichiers statiques
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.join(__dirname, 'uploads')));

// ==========================================
// GESTION DES ERREURS CSRF
// ==========================================
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        logger.warn('Token CSRF invalide detecte', {
            requestId: req.requestId,
            path: req.originalUrl,
            method: req.method,
            ip: req.ip
        });
        return res.status(403).json({ 
            error: 'Session invalide ou expirée. Veuillez rafraîchir la page.',
            code: 'CSRF_INVALID'
        });
    }
    next(err);
});

// ==========================================
// LANCEMENT DU SERVEUR
// ==========================================
// On synchronise la base de données avant de lancer le serveur
// (Utile pour vérifier que tout est calé)
// IMPORTANT: alter:true uniquement en développement (risque de perte de données en prod)
const syncOptions = process.env.NODE_ENV === 'production' 
    ? {} 
    : { alter: true };

sequelize.sync(syncOptions).then(async () => {
    logger.info(`Base de donnees synchronisee (${process.env.NODE_ENV || 'development'} mode).`);
    //APPEL DE La FONCTION POUR CREER UN ADMIN
  await createDefaultAdmin();
    app.listen(port, () => {
        logger.info(`Serveur demarre sur : http://localhost:${port}`);
    });
}).catch(err => {
    logger.error('Erreur de synchronisation Sequelize', { error: err.message, stack: err.stack });
});