const sequelize = require('../config/db');
const User = require('./user');
const Director = require('./Director');
const Submission = require('./Submission');
const Collaborator = require('./Collaborator');

// --- CORRECTION ICI ---

// 1. Relation Director <-> Submission
Director.hasMany(Submission, { 
    foreignKey: 'director_id',
    onDelete: 'CASCADE' // 👈 C'est ça qui manquait ! (Supprime les films si le réal part)
});

Submission.belongsTo(Director, { 
    foreignKey: 'director_id'
});

// 2. Relation Submission <-> Collaborator
Submission.hasMany(Collaborator, { 
    foreignKey: 'submission_id',
    onDelete: 'CASCADE' // Pareil ici : si on supprime le film, on vire l'équipe
});

Collaborator.belongsTo(Submission, { 
    foreignKey: 'submission_id' 
});




module.exports = { User, Director, Submission, Collaborator };