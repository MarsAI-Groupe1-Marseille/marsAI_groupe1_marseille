const bcrypt = require('bcrypt');
const sequelize = require('../config/db');
const { User } = require('../models');

const createDefaultJury = async () => {
  try {
    // Synchroniser la base de données
    await sequelize.authenticate();
    console.log('✓ Connexion à la base de données réussie');

    // Récupérer les credentials depuis les variables d'environnement
    const juryEmail = process.env.JURY_DEFAULT_EMAIL || 'jury@test.fr';
    const juryPassword = process.env.JURY_DEFAULT_PASSWORD;
    const juryName = process.env.JURY_DEFAULT_NAME || 'Jury Test';

    if (!juryPassword) {
      console.warn('JURY_DEFAULT_PASSWORD non défini dans .env - création jury désactivée');
      return;
    }

    // Vérifier si le jury existe déjà
    const existingJury = await User.findOne({ where: { email: juryEmail } });

    if (!existingJury) {
      console.log('Aucun jury trouvé. Création en cours...');

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(juryPassword, 10);

      // Créer l'utilisateur jury
      await User.create({
        email: juryEmail,
        password_hash: hashedPassword,
        full_name: juryName,
        role: 'jury',
        specialite: JSON.stringify(['IA Créative', 'Production Vidéo'])
      });

      console.log('Jury créé avec succès !');
      console.log('────────────────────────────────────');
      console.log('Email: ' + juryEmail);
      console.log('Mot de passe: [PROTÉGÉ - voir .env]');
      console.log('Nom: ' + juryName);
      console.log('Rôle: jury');
      console.log('────────────────────────────────────');
      console.log('\n✓ Vous pouvez maintenant vous connecter à la partie jury !');
    } else {
      console.log('Le jury existe déjà.');
      console.log('────────────────────────────────────');
      console.log('Email: ' + juryEmail);
      console.log('Mot de passe: [PROTÉGÉ - voir .env]');
      console.log('────────────────────────────────────');
    }

  } catch (error) {
    console.error('Erreur lors de la création du jury :', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

createDefaultJury();
