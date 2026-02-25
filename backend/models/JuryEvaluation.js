const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const JuryEvaluation = sequelize.define('JuryEvaluation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // submission_id et user_id sont gérés par les relations dans index.js
  vote_status: {
    type: DataTypes.ENUM('LIKE', 'DISLIKE', 'DISCUSS'),
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'jury_evaluations',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'submission_id'] // Bloque physiquement les doublons en BDD
    }
  ]
});


module.exports = JuryEvaluation;