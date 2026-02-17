const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Submission = sequelize.define('Submission', {
  // --- Titres & Textes ---
  title_original: { type: DataTypes.STRING, allowNull: false },
  title_english: { type: DataTypes.STRING, allowNull: false },
  synopsis_original: { type: DataTypes.TEXT, allowNull: false },
  synopsis_english: { type: DataTypes.TEXT, allowNull: false },

  // --- Technique ---
  duration_seconds: { type: DataTypes.INTEGER },
  language_main: { type: DataTypes.STRING },
  theme_tags: { type: DataTypes.STRING },

  // --- IA ---
  ai_classification: { type: DataTypes.ENUM('100% IA', 'Hybrid') },
  ai_tools: { type: DataTypes.TEXT },
  ai_methodology: { type: DataTypes.TEXT },

  // --- Fichiers & YouTube ---
  youtube_id: { type: DataTypes.STRING },
  s3_video_key: { type: DataTypes.STRING }, // <--- AJOUT : La clé interne S3 (ex: grp1/videos/nom.mp4)
  poster_url: { type: DataTypes.STRING },   // Sera une URL complète https://...
  gallery_urls: { type: DataTypes.JSON },   // Tableau d'URLs complètes
  has_subtitles: { type: DataTypes.BOOLEAN, defaultValue: false },
  subtitles_url: { type: DataTypes.STRING }, // <--- AJOUT : URL du fichier .srt sur S3

  // --- Statuts ---
  video_status: { 
    type: DataTypes.ENUM('uploading', 'processing', 'ready', 'error'), 
    defaultValue: 'processing' 
  },
  approval_status: { 
    type: DataTypes.ENUM('submitted', 'approved', 'rejected', 'incomplete'), 
    defaultValue: 'submitted' 
  },
  
  // --- Sélection & Récompenses (Nouveautés) ---
  is_selected: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false // Utilisé pour le Top 50
  },
  award_winner: { 
    type: DataTypes.STRING, 
    allowNull: true // Ex: 'Meilleur Scénario'
  },
  
  edit_token: { type: DataTypes.STRING }
}, {
  tableName: 'submissions',
  timestamps: true,
  underscored: true 
});

module.exports = Submission;