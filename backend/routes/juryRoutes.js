 const express = require('express');
const router = express.Router();
const juryController = require('../controllers/juryController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { validateRequest } = require('../middlewares/validationMiddleware');
const { submitVoteValidators } = require('../validators/juryValidators');

// Route pour récupérer tous les jurys
router.get('/all', juryController.getAllJury);

// Route pour récupérer tous les jurys avec statistiques
router.get('/with-stats', juryController.getAllJuryWithStats);

// Route pour soumettre ou modifier un vote
router.post('/vote', 
    verifyToken, 
    submitVoteValidators,
    validateRequest,
    juryController.submitVote);

// Route pour récupérer les votes du juré connecté
router.get('/my-votes', verifyToken, juryController.getJuryVotes);

// Route pour récupérer les playlists du jury connecté avec leurs films
router.get('/my-playlists', verifyToken, juryController.getMyPlaylists);

module.exports = router;