const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const JuryList = sequelize.define('JuryList', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'jury_lists',
  timestamps: false 
});

module.exports = JuryList;