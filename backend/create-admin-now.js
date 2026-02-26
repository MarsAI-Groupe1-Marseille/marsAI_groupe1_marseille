require('dotenv').config();
const sequelize = require('./config/db');
const createDefaultAdmin = require('./utils/createAdmin');

const initDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connexion BD réussie');
        
        await createDefaultAdmin();
        
        console.log('✅ Admin créé avec succès !');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
};

initDB();
