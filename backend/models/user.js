const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING }, 
  full_name: { type: DataTypes.STRING },
  avatar_url: { type: DataTypes.STRING },
  role: { 
    type: DataTypes.ENUM('admin', 'jury', 'moderator'), 
    defaultValue: 'jury' 
  },
  invite_token: { type: DataTypes.STRING },
  google_id: { type: DataTypes.STRING }
}, {
  tableName: 'users',
  timestamps: true, // Active la gestion automatique des dates
  
  // 👇 INDISPENSABLE : Pour dire à Sequelize d'utiliser 'created_at' au lieu de 'createdAt'
  underscored: true 
});

module.exports = User;