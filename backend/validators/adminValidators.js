const { body, param } = require('express-validator');

// ===== MODERATE SUBMISSION VALIDATORS =====
const moderateSubmissionValidators = [
    param('submissionId')
        .isInt({ min: 1 }).withMessage('ID invalide'),
    body('status')
        .notEmpty().withMessage('Statut requis')
        .isIn(['approved', 'rejected']).withMessage('Statut invalide'),
    body('issue_type')
        .if(body('status').equals('rejected'))
        .trim()
        .notEmpty().withMessage('Type d\'erreur requis pour un refus')
        .isLength({ min: 3, max: 100 }).withMessage('Type : 3-100 caractères')
        .escape(),
    body('description')
        .if(body('status').equals('rejected'))
        .trim()
        .notEmpty().withMessage('Description requise pour un refus')
        .isLength({ min: 10, max: 2000 }).withMessage('Description : 10-2000 caractères')
        .escape()
];

// ===== CREATE JURY LIST VALIDATORS =====
const createJuryListValidators = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nom de la liste requis')
        .isLength({ min: 3, max: 150 }).withMessage('Nom : 3-150 caractères')
        .escape()
];

// ===== ADD MOVIE TO PLAYLIST VALIDATORS =====
const addMovieToPlaylistValidators = [
    body('jury_list_id')
        .isInt({ min: 1 }).withMessage('ID liste invalide'),
    body('submission_id')
        .isInt({ min: 1 }).withMessage('ID film invalide')
];

// ===== ASSIGN JURY VALIDATORS =====
const assignJuryValidators = [
    body('jury_list_id')
        .isInt({ min: 1 }).withMessage('ID liste invalide'),
    body('user_id')
        .isInt({ min: 1 }).withMessage('ID utilisateur invalide')
];

// ===== DATA ID VALIDATORS (for remove operations) =====
const removeFromPlaylistValidators = [
    body('jury_list_id')
        .isInt({ min: 1 }).withMessage('ID liste invalide'),
    body('submission_id')
        .optional()
        .isInt({ min: 1 }).withMessage('ID film invalide'),
    body('user_id')
        .optional()
        .isInt({ min: 1 }).withMessage('ID utilisateur invalide')
];

// ===== DELETE JURY LIST VALIDATORS =====
const deleteJuryListValidator = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID invalide')
];

// ===== HOME CONFIG VALIDATORS =====
const homeConfigValidators = [
    body('config')
        .notEmpty().withMessage('La configuration est requise')
        .isObject().withMessage('config doit etre un objet'),
    body('config.categories.items')
        .optional()
        .custom(value => {
            if (value && !Array.isArray(value)) {
                throw new Error('config.categories.items doit etre un array');
            }
            return true;
        }),
    body('config.categories.items.*.title')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Titre : max 100 caractères')
        .escape(),
    body('config.awards.items')
        .optional()
        .custom(value => {
            if (value && !Array.isArray(value)) {
                throw new Error('config.awards.items doit etre un array');
            }
            return true;
        }),
    body('config.awards.items.*.label')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Label : max 100 caractères')
        .escape(),
    body('config.partners.items')
        .optional()
        .custom(value => {
            if (value && !Array.isArray(value)) {
                throw new Error('config.partners.items doit etre un array');
            }
            return true;
        }),
    body('config.partners.items.*.name')
        .optional()
        .trim()
        .isLength({ max: 150 }).withMessage('Nom : max 150 caractères')
        .escape()
];

module.exports = {
    moderateSubmissionValidators,
    createJuryListValidators,
    addMovieToPlaylistValidators,
    assignJuryValidators,
    removeFromPlaylistValidators,
    deleteJuryListValidator,
    homeConfigValidators
};
