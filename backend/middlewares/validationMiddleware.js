const { validationResult } = require('express-validator');
const { cleanupUploadedFiles } = require('../services/fileValidationService');

/**
 * Middleware pour vérifier les erreurs de validation
 * Si des erreurs existent, retourne un 400 avec la liste des erreurs
 * Sinon, passe au middleware suivant
 */
const validateRequest = async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // Sur routes multipart, des fichiers peuvent deja etre sur S3.
        if (req.files) {
            await cleanupUploadedFiles(req.files);
        }
        if (req.file) {
            await cleanupUploadedFiles({ avatar: [req.file] });
        }

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
