const bcrypt = require('bcrypt');
const { User } = require('../models');
const logger = require('../config/logger');

const createDefaultAdmin = async () => {
  try {
    // Récupérer les credentials depuis les variables d'environnement
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@gmail.com';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD;

    if (!adminPassword) {
      logger.warn('ADMIN_DEFAULT_PASSWORD non defini dans .env - creation admin desactivee');
      return;
    }

    // 1. On vérifie si l'admin existe déjà
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      logger.info('Aucun administrateur trouve. Creation en cours...');

      // 2. On Hache le mot de passe (10 est le "salt rounds", la complexité)
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // 3. On crée l'utilisateur
      await User.create({
        email: adminEmail,
        password_hash: hashedPassword, // On stocke le hash, JAMAIS le mot de passe clair
        full_name: 'Super Admin',
        role: 'admin'
        // invite_token, avatar_url, google_id restent null pour l'instant
      });

      logger.info('Admin cree avec succes', { email: adminEmail });
    } else {
      logger.info('L\'administrateur existe deja. Pas besoin de le recreer.');
    }

  } catch (error) {
    logger.error('Erreur lors de la creation de l\'admin', { error: error.message, stack: error.stack });
  }
};

module.exports = createDefaultAdmin;