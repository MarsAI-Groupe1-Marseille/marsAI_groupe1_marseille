const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Collaborator = sequelize.define('Collaborator', {
  role: { type: DataTypes.STRING, allowNull: false }, // Scénariste, Monteur...
  civility: { type: DataTypes.STRING }, // Ex: "M", "Mme", "Iel"
  first_name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  job_title: { type: DataTypes.STRING }
}, {
  tableName: 'collaborators',
  timestamps: true, // Souvent utile de savoir quand on a ajouté un membre
  underscored: true // Pour submission_id
});

module.exports = Collaborator;