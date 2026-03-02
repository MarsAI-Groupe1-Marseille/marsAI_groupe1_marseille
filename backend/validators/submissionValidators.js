const { body, param } = require('express-validator');

// ===== FONCTION DE VALIDATION PERSONNALISÉE =====
// Valide que c'est une liste d'éléments séparés par virgules
const validateCommaSeparatedList = (value, fieldName) => {
    if (!value || value.trim() === '') {
        return true; // Optional field
    }
    
    // Vérifier que c'est une chaîne
    if (typeof value !== 'string') {
        throw new Error(`${fieldName} doit être du texte`);
    }

    // Découper par virgule
    const items = value.split(',').map(item => item.trim());

    // Vérifier qu'aucun élément n'est vide
    if (items.some(item => item === '')) {
        throw new Error(`${fieldName}: pas d'éléments vides (ne pas écrire ", ,")`);
    }

    // Vérifier longueur de chaque élément (3-100 caractères)
    if (items.some(item => item.length < 2 || item.length > 100)) {
        throw new Error(`${fieldName}: chaque élément doit avoir 2-100 caractères`);
    }

    // Vérifier nombre d'éléments (max 20)
    if (items.length > 20) {
        throw new Error(`${fieldName}: maximum 20 éléments séparés par virgule`);
    }

    return true;
};

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
        .isLength({ min: 2, max: 2000 }).withMessage('Synopsis : 2-2000 caractères')
        .escape(),
    body('synopsis_english')
        .trim()
        .notEmpty().withMessage('Synopsis anglais requis')
        .isLength({ min: 2, max: 2000 }).withMessage('Synopsis : 2-2000 caractères')
        .escape(),

    // Durée
    body('duration_seconds')
        .optional()
        .isInt({ min: 60, max: 3600 }).withMessage('Durée : entre 1 et 60 minutes'),

    // Langue - Accepte codes ISO ou noms complets (Francais, English, etc.)
    body('language_main')
        .notEmpty().withMessage('Langue requise')
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Langue : 2-50 caractères')
        .escape(),

    // Tags/Thèmes - VALIDÉ PAR VIRGULES
    body('theme_tags')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Tags : max 500 caractères')
        .custom((value) => validateCommaSeparatedList(value, 'Themes/Tags'))
        .escape(),

    // IA
    body('ai_classification')
        .notEmpty().withMessage('Classification IA requise')
        .isIn(['100% IA', 'Hybrid']).withMessage('Classification invalide'),
    
    // AI TOOLS - VALIDÉ PAR VIRGULES
    body('ai_tools')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Outils IA : max 1000 caractères')
        .custom((value) => validateCommaSeparatedList(value, 'Outils IA'))
        .escape(),
    
    // AI METHODOLOGY - PEUT ÊTRE DU TEXTE LIBRE MAIS VALIDÉ
    body('ai_methodology')
        .optional()
        .trim()
        .if(value => value && value.length > 0)
        .isLength({ min: 5, max: 2000 }).withMessage('Méthodologie : 5-2000 caractères')
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
        .if(value => value && value.length > 0)
        .matches(/^[0-9+\s\-()]+$/).withMessage('Téléphone: caractères valides uniquement (0-9, +, -, (), espaces)'),
    body('director_mobile')
        .trim()
        .notEmpty().withMessage('Mobile requis')
        .matches(/^[0-9+\s\-()]+$/).withMessage('Mobile: caractères valides uniquement (0-9, +, -, (), espaces)'),
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
