 const express = require('express');
const router = express.Router();
const juryController = require('../controllers/juryController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route pour soumettre ou modifier un vote
router.post('/vote', authMiddleware.verifyToken, juryController.submitVote);

// Route pour récupérer les votes du juré connecté
router.get('/my-votes', authMiddleware.verifyToken, juryController.getJuryVotes);

module.exports = router;