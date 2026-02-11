const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const JuryMember = sequelize.define('JuryMember', {
  // Pas de clé primaire auto-increment ici, c'est une clé composée
  // Sequelize gérera les FK user_id et jury_list_id
}, {
  tableName: 'jury_members',
  timestamps: false
});

module.exports = JuryMember;