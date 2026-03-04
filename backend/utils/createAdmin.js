const bcrypt = require('bcrypt');
const { User } = require('../models');

const createDefaultAdmin = async () => {
  try {
    // Récupérer les credentials depuis les variables d'environnement
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@gmail.com';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD;

    if (!adminPassword) {
      console.warn('ADMIN_DEFAULT_PASSWORD non défini dans .env - création admin désactivée');
      return;
    }

    // 1. On vérifie si l'admin existe déjà
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      console.log('Aucun administrateur trouvé. Création en cours...');

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

      console.log('Admin créé avec succès !');
      console.log(`Email: ${adminEmail}`);
      console.log('Mot de passe: [PROTÉGÉ - voir .env]');
    } else {
      console.log('L\'administrateur existe déjà. Pas besoin de le recréer.');
    }

  } catch (error) {
    console.error('Erreur lors de la création de l\'admin :', error);
  }
};

module.exports = createDefaultAdmin;