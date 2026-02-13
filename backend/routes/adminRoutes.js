const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');



// URL : POST http://localhost:3000/api/admin/moderation/:submissionId
// route pour modérer une soumission (approbation ou refus avec motif)
// Body : { status: 'approved' } ou { status: 'rejected', issue_type: '...', description: '...' }
router.post('/moderation/:submissionId', 
    verifyToken,          // 1. Vérification connexion
    checkRole('admin'),   // 2. Vérification rôle Admin
    adminController.moderateSubmission // 3. La nouvelle logique unique
); 
// route pour creeé une playlist de jury 
router.post('/jury-list',
    verifyToken,
    checkRole('admin'),
    adminController.createJuryList
);
// route qui assigne un film a une play list
router.post('/assigne-film',
    verifyToken,
    checkRole('admin'),
    adminController.addMovieToPlayList);



module.exports = router;

