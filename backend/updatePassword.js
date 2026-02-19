const { User } = require('./models');
const sequelize = require('./config/db');
const bcrypt = require('bcryptjs');

async function updatePassword() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la BD réussie');

    // Générer un nouveau hash
    const password = 'password123';
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(password, salt);
    
    console.log(`\n🔐 Nouveau hash généré:`);
    console.log(`Hash: ${newHash}`);
    console.log(`Length: ${newHash.length}`);

    // Mettre à jour l'utilisateur
    const user = await User.findOne({ where: { email: 'jury@test.com' } });
    
    if (!user) {
      console.log('❌ Utilisateur jury@test.com NOT FOUND');
      process.exit(1);
    }

    user.password_hash = newHash;
    await user.save();
    
    console.log(`\n✅ Utilisateur mis à jour avec nouveau hash`);

    // Vérifier que le hash a été sauvegardé
    const updatedUser = await User.findOne({ where: { email: 'jury@test.com' } });
    console.log(`\n🔍 Vérification du hash sauvegardé:`);
    console.log(`Hash stored: ${updatedUser.password_hash}`);
    console.log(`Length: ${updatedUser.password_hash.length}`);

    // Tester le mot de passe
    const isMatch = await bcrypt.compare(password, updatedUser.password_hash);
    console.log(`\n🔐 Password Test: ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

updatePassword();
