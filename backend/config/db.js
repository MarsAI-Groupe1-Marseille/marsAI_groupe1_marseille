// backend/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();
const logger = require('./logger');

// Création de l'instance Sequelize
// On lui donne le nom de la BDD, l'utilisateur, le mot de passe et les options
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost', // Par défaut localhost 
        dialect: 'mysql', // Très important : on précise qu'on utilise MySQL
        logging: false,   // false = ne pas polluer la console avec toutes les requêtes SQL brutes
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Test immédiat de la connexion (Optionnel mais recommandé pour le debug)
sequelize.authenticate()
    .then(() => {
        logger.info('Connexion Sequelize reussie a MySQL');
    })
    .catch(err => {
        logger.error('Impossible de se connecter a la base de donnees', { error: err.message, stack: err.stack });
    });

module.exports = sequelize;