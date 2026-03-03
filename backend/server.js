// backend/server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
require('./config/passport');

const createDefaultAdmin = require('./utils/createAdmin');

// Import de la connexion Sequelize
const sequelize = require('./config/db');

// Import des middlewares de sécurité
const { helmetConfig, generalLimiter } = require('./middlewares/securityMiddleware');
const { sessionMiddleware, csrfProtection } = require('./middlewares/csrfMiddleware');

const app = express();
const port = process.env.PORT || 3000;


// Imports des routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const juryRoutes = require('./routes/juryRoutes');





// ==========================================
// MIDDLEWARES
// ==========================================
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
];

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
app.use(generalLimiter);         // Rate limiting général (100 req/15min)

// Autorise des payloads plus volumineux (config home avec images base64 avant upload S3)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser()); // Pour parser les cookies
app.use(sessionMiddleware);  // Session pour CSRF
app.use(csrfProtection); // Protection CSRF
app.use(passport.initialize());


// ==========================================
// ROUTES
// ==========================================

// Route pour récupérer le token CSRF
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Utilisation des routes préfixées
app.use('/api/auth', authRoutes);         
app.use('/api/users', userRoutes);        
app.use('/api/submissions', submissionRoutes); 
app.use('/api/admin', adminRoutes); // Routes admin (validation des films, modération, etc.)
app.use('/api/jury', juryRoutes); 

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
        console.warn('Token CSRF invalide détecté');
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
sequelize.sync({alter:true}).then(async () => {
    console.log("Base de données synchronisée.");
    //APPEL DE La FONCTION POUR CREER UN ADMIN
  await createDefaultAdmin();
    app.listen(port, () => {
        console.log(`Serveur démarré sur : http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Erreur de synchronisation Sequelize :", err);
});