const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: {
      name: 'unique_user_email',
      msg: 'Email déjà utilisé'
    }
  },
  password_hash: { type: DataTypes.STRING }, 
  full_name: { type: DataTypes.STRING },
  avatar_url: { type: DataTypes.STRING },
  specialite: { type: DataTypes.JSON, allowNull: true },
  role: { 
    type: DataTypes.ENUM('admin', 'jury', 'moderator'), 
    defaultValue: 'jury' 
  },
  account_status: {
    type: DataTypes.ENUM('pending', 'active'),
    allowNull: false,
    defaultValue: 'pending'
  },
  invite_token: { type: DataTypes.STRING },
  invite_token_expires_at: { type: DataTypes.DATE },
  google_id: { type: DataTypes.STRING }
}, {
  tableName: 'users',
  timestamps: true, // Active la gestion automatique des dates
  
  // 👇 INDISPENSABLE : Pour dire à Sequelize d'utiliser 'created_at' au lieu de 'createdAt'
  underscored: true 
});

module.exports = User;