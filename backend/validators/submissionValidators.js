const { body, param } = require('express-validator');

// ===== SUBMISSION CREATION VALIDATORS =====
const submissionValidators = [
    // Titres
    body('title_original')
        .trim()
        .notEmpty().withMessage('Titre original requis')
        .isLength({ min: 3, max: 200 }).withMessage('Titre : 3-200 caractères')
        .escape(),
    body('title_english')
        .trim()
        .notEmpty().withMessage('Titre anglais requis')
        .isLength({ min: 3, max: 200 }).withMessage('Titre : 3-200 caractères')
        .escape(),

    // Synopsis
    body('synopsis_original')
        .trim()
        .notEmpty().withMessage('Synopsis original requis')
        .isLength({ min: 50, max: 2000 }).withMessage('Synopsis : 50-2000 caractères')
        .escape(),
    body('synopsis_english')
        .trim()
        .notEmpty().withMessage('Synopsis anglais requis')
        .isLength({ min: 50, max: 2000 }).withMessage('Synopsis : 50-2000 caractères')
        .escape(),

    // Durée
    body('duration_seconds')
        .optional()
        .isInt({ min: 60, max: 3600 }).withMessage('Durée : entre 1 et 60 minutes'),

    // Langue
    body('language_main')
        .notEmpty().withMessage('Langue requise')
        .isIn(['fr', 'en', 'es', 'de']).withMessage('Langue non acceptée'),

    // Tags/Thèmes
    body('theme_tags')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Tags : max 500 caractères')
        .escape(),

    // IA
    body('ai_classification')
        .notEmpty().withMessage('Classification IA requise')
        .isIn(['100% IA', 'Hybrid']).withMessage('Classification invalide'),
    body('ai_tools')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Max 1000 caractères')
        .escape(),
    body('ai_methodology')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('Max 2000 caractères')
        .escape(),

    // DIRECTOR
    body('director_civility')
        .isIn(['M', 'Mme', 'Iel']).withMessage('Civilité invalide'),
    body('director_firstname')
        .trim()
        .notEmpty().withMessage('Prénom réalisateur requis')
        .isLength({ min: 2, max: 100 }).withMessage('Prénom : 2-100 caractères')
        .escape(),
    body('director_lastname')
        .trim()
        .notEmpty().withMessage('Nom réalisateur requis')
        .isLength({ min: 2, max: 100 }).withMessage('Nom : 2-100 caractères')
        .escape(),
    body('director_birth_date')
        .notEmpty().withMessage('Date de naissance requise')
        .isISO8601().withMessage('Date invalide')
        .custom(value => {
            const birthDate = new Date(value);
            const today = new Date();
            if (birthDate > today) {
                throw new Error('Date de naissance invalide');
            }
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 18) {
                throw new Error('Minimum 18 ans requis');
            }
            return true;
        }),
    body('director_email')
        .isEmail().withMessage('Email invalide')
        .normalizeEmail()
        .trim(),
    body('director_phone')
        .optional()
        .trim()
        .matches(/^[0-9+\s\-()]+$/).withMessage('Numéro de téléphone invalide'),
    body('director_mobile')
        .trim()
        .notEmpty().withMessage('Mobile requis')
        .matches(/^[0-9+\s\-()]+$/).withMessage('Numéro invalide'),
    body('director_address')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Max 200 caractères')
        .escape(),
    body('director_zip_code')
        .optional()
        .trim()
        .matches(/^[0-9\s\-a-zA-Z]{2,10}$/).withMessage('Code postal invalide'),
    body('director_city')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Max 100 caractères')
        .escape(),
    body('director_country')
        .notEmpty().withMessage('Pays requis')
        .isLength({ min: 2, max: 100 }).withMessage('Pays invalide')
        .escape(),
    body('director_job_title')
        .trim()
        .notEmpty().withMessage('Métier requis')
        .isLength({ min: 2, max: 100 }).withMessage('Métier : 2-100 caractères')
        .escape(),
    body('director_marketing_source')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Max 200 caractères')
        .escape()
];

// ===== SUBMISSION ID VALIDATORS =====
const submissionIdValidator = [
    param('id')
        .isInt({ min: 1 }).withMessage('ID invalide')
];

module.exports = {
    submissionValidators,
    submissionIdValidator
};
