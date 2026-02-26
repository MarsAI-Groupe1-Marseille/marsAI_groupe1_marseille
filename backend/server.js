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
app.use(express.json());
app.use(cookieParser()); // Pour parser les cookies
app.use(passport.initialize());


// ==========================================
// ROUTES
// ==========================================

// Utilisation des routes préfixées
app.use('/api/auth', authRoutes);         
app.use('/api/users', userRoutes);        
app.use('/api/submissions', submissionRoutes); 
app.use('/api/admin', adminRoutes); // Routes admin (validation des films, modération, etc.)

// ... Tes autres routes
app.use('/api/submissions', submissionRoutes); 
app.use('/api/admin', adminRoutes);

// AJOUTE CETTE LIGNE ICI 👇
app.use('/api/jury', juryRoutes); 

// ...


// Servir les fichiers statiques du dossier uploads avec chemin absolu
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ==========================================
// LANCEMENT DU SERVEUR
// ==========================================
// On synchronise la base de données avant de lancer le serveur
// (Utile pour vérifier que tout est calé)
sequelize.sync({alter:true}).then(async () => {
    console.log("Base de données synchronisée.");
    // 👇 APPEL DE La FONCTION POUR CREER UN ADMIN
  await createDefaultAdmin();
    app.listen(port, () => {
        console.log(`Serveur démarré sur : http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Erreur de synchronisation Sequelize :", err);
});