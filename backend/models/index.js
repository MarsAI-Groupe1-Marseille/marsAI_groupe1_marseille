const sequelize = require('../config/db');

// Import des modèles
const User = require('./user'); 
const Director = require('./Director');
const Submission = require('./Submission');
const Collaborator = require('./Collaborator');
const JuryList = require('./JuryList');
const JuryEvaluation = require('./JuryEvaluation');
const ModerationTicket = require('./ModerationTicket');
const JuryMember = require('./JuryMember');
const JuryListSubmission = require('./JuryListSubmission');

// ====================================================
// DEFINITION DES RELATIONS
// ====================================================

// --- 1. Director <-> Submission ---
Director.hasMany(Submission, { 
    foreignKey: 'director_id',
    onDelete: 'CASCADE'
});
Submission.belongsTo(Director, { 
    foreignKey: 'director_id'
});

// --- 2. Submission <-> Collaborator ---
Submission.hasMany(Collaborator, { 
    foreignKey: 'submission_id',
    onDelete: 'CASCADE'
});
Collaborator.belongsTo(Submission, { 
    foreignKey: 'submission_id' 
});

// --- 3. User (Jury) <-> JuryList (Many-to-Many via JuryMember) ---
User.belongsToMany(JuryList, { 
    through: JuryMember,
    foreignKey: 'user_id',
    otherKey: 'jury_list_id'
});
JuryList.belongsToMany(User, { 
    through: JuryMember,
    foreignKey: 'jury_list_id',
    otherKey: 'user_id'
});

// --- 4. JuryList <-> Submission (Many-to-Many via JuryListSubmission) ---
JuryList.belongsToMany(Submission, { 
    through: JuryListSubmission,
    foreignKey: 'jury_list_id',
    otherKey: 'submission_id'
});
Submission.belongsToMany(JuryList, { 
    through: JuryListSubmission,
    foreignKey: 'submission_id',
    otherKey: 'jury_list_id'
});

// --- 5. JuryEvaluation (Le vote d'un User sur une Submission) ---
User.hasMany(JuryEvaluation, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
JuryEvaluation.belongsTo(User, { foreignKey: 'user_id' });

Submission.hasMany(JuryEvaluation, {
    foreignKey: 'submission_id',
    onDelete: 'CASCADE'
});
JuryEvaluation.belongsTo(Submission, { foreignKey: 'submission_id' });

// --- 6. ModerationTicket (Admin sur Submission) ---
User.hasMany(ModerationTicket, {
    foreignKey: 'admin_id',
    as: 'TicketsHandled' // Alias utile pour différencier des autres relations User
});
ModerationTicket.belongsTo(User, { foreignKey: 'admin_id', as: 'Admin' });

Submission.hasMany(ModerationTicket, {
    foreignKey: 'submission_id',
    onDelete: 'CASCADE'
});
ModerationTicket.belongsTo(Submission, { foreignKey: 'submission_id' });


// Export de tous les modèles et de l'instance
module.exports = { 
    sequelize,
    User, 
    Director, 
    Submission, 
    Collaborator,
    JuryList,
    JuryEvaluation,
    ModerationTicket,
    JuryMember,
    JuryListSubmission
};