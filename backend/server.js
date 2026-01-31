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
app.use(cors());
app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

app.get('/', (req, res) => {
    res.send('Serveur Mars AI (via Sequelize) est en ligne !');
});

// Route de test pour vérifier que Sequelize lit bien les tables
app.get('/api/test-db', async (req, res) => {
    try {
        // Utilisation de _metadata (préfixe _) pour indiquer que la variable est ignorée
        const [results, _metadata] = await sequelize.query("SELECT * FROM ROLE");
        
        res.json({
            message: "Test Sequelize réussi ! Voici les rôles :",
            data: results
        });
    } catch (error) {
        // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.log("Base de données synchronisée.");
    app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Serveur démarré sur : http://localhost:${port}`);
    });
}).catch(err => {
    // eslint-disable-next-line no-console
    console.error("Erreur de synchronisation Sequelize :", err);
});