// Script pour mettre à jour le nom du réalisateur
require('dotenv').config();
const sequelize = require('./config/db');
const Director = require('./models/Director');

async function updateDirector() {
  try {
    // Synchroniser les modèles
    await sequelize.sync();
    
    // Chercher le réalisateur "steve" avec le nom "guillén"
    const director = await Director.findOne({
      where: {
        first_name: 'steve',
        last_name: 'guillén'
      }
    });
    
    if (director) {
      console.log('Réalisateur trouvé:', director.first_name, director.last_name);
      
      // Mettre à jour le nom
      director.first_name = 'Steve';
      director.last_name = 'Guillian';
      
      await director.save();
      
      console.log('Réalisateur mis à jour avec succès!');
      console.log('Nouveau nom:', director.first_name, director.last_name);
    } else {
      console.log('Réalisateur "steve guillén" non trouvé');
      
      // Chercher tous les réalisateurs avec "steve" en minuscules
      const allSteves = await Director.findAll({
        where: {
          first_name: 'steve'
        }
      });
      
      console.log('Réalisateurs trouvés avec le prénom "steve":', allSteves.length);
      allSteves.forEach(d => {
        console.log(`- ${d.first_name} ${d.last_name}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

updateDirector();
