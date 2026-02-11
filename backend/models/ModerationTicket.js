const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ModerationTicket = sequelize.define('ModerationTicket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // admin_id et submission_id gérés par les relations
  issue_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_resolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'moderation_tickets',
  timestamps: false
});

module.exports = ModerationTicket;