const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Director = sequelize.define('Director', {
  // Identité
  civility: { type: DataTypes.ENUM('M', 'Mme', 'Iel'), defaultValue: 'M' },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  birth_date: { type: DataTypes.DATEONLY, allowNull: false },

  // Contact
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING },
  mobile: { type: DataTypes.STRING, allowNull: false },

  // Adresse
  address: { type: DataTypes.STRING },
  zip_code: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },

  // Pro
  job_title: { type: DataTypes.STRING, allowNull: false },
  social_links: { type: DataTypes.JSON }, // Stocké en JSON
  marketing_source: { type: DataTypes.STRING },
  newsletter_optin: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'directors',
  timestamps: true,   // Gère created_at / updated_at
  underscored: true   // convertit camelCase <-> snake_case
});

module.exports = Director;