const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const JuryListSubmission = sequelize.define('JuryListSubmission', {
  added_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'jury_list_submissions',
  timestamps: false
});

module.exports = JuryListSubmission;