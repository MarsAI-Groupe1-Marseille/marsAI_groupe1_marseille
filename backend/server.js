// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const createDefaultAdmin = require('./utils/createAdmin');

// Import de la connexion Sequelize
const sequelize = require('./config/db');

const app = express();
const port = process.env.PORT || 3000;


// Imports des routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const submissionRoutes = require('./routes/submissionRoutes');





// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

// Utilisation des routes préfixées
app.use('/api/auth', authRoutes);         
app.use('/api/users', userRoutes);        
app.use('/api/submissions', submissionRoutes); 





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