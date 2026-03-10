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
    const normalizedValue = value.trim();

    // Si l'utilisateur saisit plusieurs mots sans virgule, on force le format liste.
    if (!normalizedValue.includes(',') && /\s+/.test(normalizedValue)) {
        throw new Error(`${fieldName}: utilisez des virgules pour séparer les éléments (ex: "A, B, C")`);
    }

    const items = normalizedValue.split(',').map(item => item.trim());

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

const validateCollaboratorsJson = (value) => {
    if (!value || value.trim() === '') return true;

    let parsed;
    try {
        parsed = JSON.parse(value);
    } catch (error) {
        throw new Error('collaborators_json doit etre un JSON valide');
    }

    if (!Array.isArray(parsed)) {
        throw new Error('collaborators_json doit etre un tableau JSON');
    }

    if (parsed.length > 50) {
        throw new Error('collaborators_json: maximum 50 collaborateurs');
    }

    parsed.forEach((collab, index) => {
        if (!collab || typeof collab !== 'object' || Array.isArray(collab)) {
            throw new Error(`collaborators_json[${index}] doit etre un objet`);
        }

        const requiredFields = ['first_name', 'last_name', 'role'];
        requiredFields.forEach((field) => {
            if (typeof collab[field] !== 'string' || collab[field].trim().length < 2) {
                throw new Error(`collaborators_json[${index}].${field} requis (min 2 caracteres)`);
            }
            if (collab[field].trim().length > 100) {
                throw new Error(`collaborators_json[${index}].${field} trop long (max 100)`);
            }
        });
    });

    return true;
};

const validateDirectorSocialLinksJson = (value) => {
    if (!value || value.trim() === '') return true;

    let parsed;
    try {
        parsed = JSON.parse(value);
    } catch (error) {
        throw new Error('director_social_links doit etre un JSON valide');
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('director_social_links doit etre un objet JSON');
    }

    const allowedKeys = ['website', 'instagram', 'linkedin', 'youtube', 'vimeo', 'tiktok', 'x'];
    Object.keys(parsed).forEach((key) => {
        if (!allowedKeys.includes(key)) {
            throw new Error(`director_social_links: cle non autorisee (${key})`);
        }

        if (typeof parsed[key] !== 'string' || parsed[key].length > 300) {
            throw new Error(`director_social_links.${key} doit etre un texte (max 300)`);
        }

        const normalizedValue = parsed[key].trim();
        if (normalizedValue.length > 0 && !/^https:\/\//i.test(normalizedValue)) {
            throw new Error(`director_social_links.${key}: URL https obligatoire`);
        }
    });

    return true;
};

// ===== SUBMISSION CREATION VALIDATORS =====
const submissionValidators = [
    // Titres
    body('title_original')
        .trim()
        .notEmpty().withMessage('Titre original requis')
        .isLength({ min: 3, max: 200 }).withMessage('Titre : 3-200 caractères'),

    body('title_english')
        .trim()
        .notEmpty().withMessage('Titre anglais requis')
        .isLength({ min: 3, max: 200 }).withMessage('Titre : 3-200 caractères'),


    // Synopsis
    body('synopsis_original')
        .trim()
        .notEmpty().withMessage('Synopsis original requis')
        .isLength({ min: 2, max: 2000 }).withMessage('Synopsis : 2-2000 caractères'),

    body('synopsis_english')
        .trim()
        .notEmpty().withMessage('Synopsis anglais requis')
        .isLength({ min: 2, max: 2000 }).withMessage('Synopsis : 2-2000 caractères'),


    // Durée
    body('duration_seconds')
        .optional()
        .isInt({ min: 60, max: 3600 }).withMessage('Durée : entre 1 et 60 minutes'),

    // Langue - Accepte codes ISO ou noms complets (Francais, English, etc.)
    body('language_main')
        .notEmpty().withMessage('Langue requise')
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Langue : 2-50 caractères'),


    // Tags/Thèmes - VALIDÉ PAR VIRGULES
    body('theme_tags')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Tags : max 500 caractères')
        .custom((value) => validateCommaSeparatedList(value, 'Themes/Tags')),


    // IA
    body('ai_classification')
        .notEmpty().withMessage('Classification IA requise')
        .isIn(['100% IA', 'Hybrid']).withMessage('Classification invalide'),
    
    // AI TOOLS - VALIDÉ PAR VIRGULES
    body('ai_tools')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Outils IA : max 1000 caractères')
        .custom((value) => validateCommaSeparatedList(value, 'Outils IA')),

    
    // AI METHODOLOGY - PEUT ÊTRE DU TEXTE LIBRE MAIS VALIDÉ
    body('ai_methodology')
        .optional()
        .trim()
        .if(value => value && value.length > 0)
        .isLength({ min: 5, max: 2000 }).withMessage('Méthodologie : 5-2000 caractères'),


    // DIRECTOR
    body('director_civility')
        .isIn(['M', 'Mme', 'Iel']).withMessage('Civilité invalide'),
    body('director_firstname')
        .trim()
        .notEmpty().withMessage('Prénom réalisateur requis')
        .isLength({ min: 2, max: 100 }).withMessage('Prénom : 2-100 caractères'),

    body('director_lastname')
        .trim()
        .notEmpty().withMessage('Nom réalisateur requis')
        .isLength({ min: 2, max: 100 }).withMessage('Nom : 2-100 caractères'),

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
        .isLength({ max: 200 }).withMessage('Max 200 caractères'),

    body('director_zip_code')
        .optional()
        .trim()
        .matches(/^[0-9\s\-a-zA-Z]{2,10}$/).withMessage('Code postal invalide'),
    body('director_city')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Max 100 caractères'),

    body('director_country')
        .notEmpty().withMessage('Pays requis')
        .isLength({ min: 2, max: 100 }).withMessage('Pays invalide'),

    body('director_job_title')
        .trim()
        .notEmpty().withMessage('Métier requis')
        .isLength({ min: 2, max: 100 }).withMessage('Métier : 2-100 caractères'),

    body('director_marketing_source')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Max 200 caractères'),


    // JSON STRUCTURE
    body('collaborators_json')
        .optional()
        .custom(validateCollaboratorsJson),
    body('director_social_links')
        .optional()
        .custom(validateDirectorSocialLinksJson)
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
