const { body } = require('express-validator');

// ===== LOGIN VALIDATORS =====
const loginValidators = [
    body('email')
        .isEmail().withMessage('Email invalide')
        .normalizeEmail()
        .trim()
        .escape(),
    body('password')
        .notEmpty().withMessage('Mot de passe requis')
        .isLength({ min: 6 }).withMessage('6 caractères minimum')
];

// ===== FORGOT PASSWORD VALIDATORS =====
const forgotPasswordValidators = [
    body('email')
        .isEmail().withMessage('Email invalide')
        .normalizeEmail()
        .trim()
];

// ===== RESET PASSWORD VALIDATORS =====
const resetPasswordValidators = [
    body('token')
        .notEmpty().withMessage('Token requis'),
    body('new_password')
        .isLength({ min: 6 }).withMessage('Minimum 6 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Au moins 1 majuscule, 1 minuscule, 1 chiffre')
];

module.exports = {
    loginValidators,
    forgotPasswordValidators,
    resetPasswordValidators
};
