const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Modèle pour la configuration du site (home page, etc.)
const SiteConfig = sequelize.define('SiteConfig', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    config_key: {
        type: DataTypes.STRING(50),
        unique: {
            name: 'unique_config_key',
            msg: 'Config key doit être unique'
        },
        allowNull: false,
        defaultValue: 'home_page',
        comment: 'Clé identifiant la config (ex: home_page, footer, header)'
    },
    config_data: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Données de configuration en JSON (hero, categories, awards, partners)'
    }
}, {
    tableName: 'site_config',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = SiteConfig;
