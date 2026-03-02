const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const upload = require('../middlewares/uploadMiddleware'); // Import du middleware multer
const { validateRequest } = require('../middlewares/validationMiddleware');
const { submissionValidators } = require('../validators/submissionValidators');

// Route pour créer une nouvelle soumission avec upload de fichiers

router.post('/', 
    upload.fields([
        { name: 'video_file', maxCount: 1 },      // 1 Vidéo (Obligatoire)
        { name: 'poster_file', maxCount: 1 },     // 1 Affiche (Obligatoire)
        { name: 'subtitle_file', maxCount: 1 },   // 1 Fichier sous-titre (Optionnel)
        { name: 'gallery_files', maxCount: 10 }   // 10 Photos max (Optionnel)
    ]),
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