// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import de la connexion Sequelize
const sequelize = require('./config/db');

const app = express();
const port = process.env.PORT || 3000;

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

app.get('/', (req, res) => {
    res.send('Serveur Mars AI (via Sequelize) est en ligne !');
});

app.get('/api/', (req, res) => {
    res.send('Serveur Mars AI (via Sequelize) est en ligne !');
});

// Route de test pour vérifier que Sequelize lit bien tes tables
app.get('/api/test-db', async (req, res) => {
    try {
        // En attendant de créer tes Modèles (User.js, Role.js...), 
        // on fait une requête brute juste pour vérifier la connexion.
        const [results, metadata] = await sequelize.query("SELECT * FROM users");
        
        res.json({
            message: "Test Sequelize réussi ! Voici les rôles :",
            data: results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des données" });
    }
});

// ==========================================
// LANCEMENT DU SERVEUR
// ==========================================
// On synchronise la base de données avant de lancer le serveur
// (Utile pour vérifier que tout est calé)
sequelize.sync().then(() => {
    console.log("Base de données synchronisée.");
    app.listen(port, () => {
        console.log(`Serveur démarré sur : http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Erreur de synchronisation Sequelize :", err);
});