const { body, param } = require('express-validator');

// ===== CREATE USER VALIDATORS =====
const createUserValidators = [
    body('email')
        .isEmail().withMessage('Email invalide')
        .normalizeEmail()
        .trim(),
    body('full_name')
        .trim()
        .notEmpty().withMessage('Nom complet requis')
        .isLength({ min: 3, max: 150 }).withMessage('Nom : 3-150 caractères')
        .escape(),
    body('role')
        .notEmpty().withMessage('Rôle requis')
        .isIn(['jury', 'admin', 'moderator']).withMessage('Rôle invalide')
];

// ===== ACTIVATE ACCOUNT VALIDATORS =====
const activateAccountValidators = [
    body('token')
        .notEmpty().withMessage('Token requis'),
    body('new_password')
        .notEmpty().withMessage('Mot de passe requis')
        .isLength({ min: 6 }).withMessage('Minimum 6 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Au moins 1 majuscule, 1 minuscule, 1 chiffre'),
    body('specialite')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Max 500 caractères')
        .escape()
];

module.exports = {
    createUserValidators,
    activateAccountValidators
};
