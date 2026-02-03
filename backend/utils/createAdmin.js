const bcrypt = require('bcrypt');
const { User } = require('../models'); // Assure-toi que le chemin vers tes modèles est bon

const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'AdminPassword123!'; // Le mot de passe par défaut

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
      console.log(`Password: ${adminPassword}`);
    } else {
      console.log('L\'administrateur existe déjà. Pas besoin de le recréer.');
    }

  } catch (error) {
    console.error('Erreur lors de la création de l\'admin :', error);
  }
};

module.exports = createDefaultAdmin;