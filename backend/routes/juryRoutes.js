 const express = require('express');
const router = express.Router();
const juryController = require('../controllers/juryController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route pour soumettre ou modifier un vote
router.post('/vote', authMiddleware.verifyToken, juryController.submitVote);

// Route pour récupérer les votes du juré connecté
router.get('/my-votes', authMiddleware.verifyToken, juryController.getJuryVotes);

// Route pour récupérer les playlists du jury connecté avec leurs films
router.get('/my-playlists', authMiddleware.verifyToken, juryController.getMyPlaylists);

module.exports = router;