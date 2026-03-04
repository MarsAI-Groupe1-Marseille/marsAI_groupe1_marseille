const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const upload = require('../middlewares/uploadMiddleware'); // Import du middleware multer
const { validateRequest } = require('../middlewares/validationMiddleware');
const { csrfProtection } = require('../middlewares/csrfMiddleware');
const { submissionValidators } = require('../validators/submissionValidators');
const { uploadLimiter } = require('../middlewares/securityMiddleware');

const uploadSubmissionFields = upload.fields([
    { name: 'video_file', maxCount: 1 },
    { name: 'poster_file', maxCount: 1 },
    { name: 'subtitle_file', maxCount: 1 },
    { name: 'gallery_files', maxCount: 10 }
]);

const handleSubmissionUpload = (req, res, next) => {
    uploadSubmissionFields(req, res, (err) => {
        if (!err) return next();

        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'Le fichier depasse la taille maximale autorisee (500MB).',
                errors: [{ field: err.field || 'file', message: 'Fichier trop volumineux (max 500MB).' }]
            });
        }

        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                message: 'Un fichier non attendu a ete envoye.',
                errors: [{ field: err.field || 'file', message: 'Champ de fichier non autorise.' }]
            });
        }

        return res.status(400).json({
            message: err.message || 'Erreur de validation fichier.',
            errors: [{ field: err.field || 'file', message: err.message || 'Fichier invalide.' }]
        });
    });
};

// Route pour créer une nouvelle soumission avec upload de fichiers

router.post('/', 
    uploadLimiter,              // Limiter les uploads: 10/h par IP
    handleSubmissionUpload,
    csrfProtection,
    submissionValidators,
    validateRequest,
    submissionController.createSubmission
);

// 2. Route GET ALL (Galerie ) avec pagination et filtrage par catégorie (thème) et recherche par titre
// Pas de middleware multer ici, on ne fait que lire
router.get('/', submissionController.getAllSubmissions);


// 3. Route GET GENRES (Récupérer tous les genres uniques)
// IMPORTANT : Cette route doit être AVANT /:id sinon "genres" sera interprété comme un id
router.get('/genres/all', submissionController.getAllGenres);

// 4. Route GET ONE (Détail)
// ":id" est une variable dynamique (ex: 1, 45, 99)
router.get('/:id', submissionController.getSubmissionById);

module.exports = router;