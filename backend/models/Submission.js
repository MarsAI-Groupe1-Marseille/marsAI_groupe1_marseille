const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Submission = sequelize.define('Submission', {
  // Titres & Textes
  title_original: { type: DataTypes.STRING, allowNull: false },
  title_english: { type: DataTypes.STRING, allowNull: false },
  synopsis_original: { type: DataTypes.TEXT, allowNull: false },
  synopsis_english: { type: DataTypes.TEXT, allowNull: false },

  // Technique
  duration_seconds: { type: DataTypes.INTEGER },
  language_main: { type: DataTypes.STRING },
  theme_tags: { type: DataTypes.STRING },

  // IA
  ai_classification: { type: DataTypes.ENUM('100% IA', 'Hybrid') },
  ai_tools: { type: DataTypes.TEXT },
  ai_methodology: { type: DataTypes.TEXT },

  // Fichiers & YouTube
  youtube_id: { type: DataTypes.STRING },
  poster_url: { type: DataTypes.STRING },
  gallery_urls: { type: DataTypes.JSON },
  has_subtitles: { type: DataTypes.BOOLEAN, defaultValue: false },

  // Statuts
  video_status: { 
    type: DataTypes.ENUM('uploading', 'processing', 'ready', 'error'), 
    defaultValue: 'processing' 
  },
  approval_status: { 
    type: DataTypes.ENUM('submitted', 'approved', 'rejected', 'incomplete'), 
    defaultValue: 'submitted' 
  },
  
  edit_token: { type: DataTypes.STRING }
}, {
  tableName: 'submissions',
  timestamps: true,
  underscored: true // Indispensable pour lier director_id automatiquement
});

module.exports = Submission;