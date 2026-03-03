const { validationResult } = require('express-validator');

/**
 * Middleware pour vérifier les erreurs de validation
 * Si des erreurs existent, retourne un 400 avec la liste des erreurs
 * Sinon, passe au middleware suivant
 */
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Erreurs de validation',
            errors: errors.array().map(error => ({
                field: error.param,
                message: error.msg
            }))
        });
    }
    
    next();
};

module.exports = { validateRequest };
