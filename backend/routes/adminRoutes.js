const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const finalistController = require('../controllers/finalistController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// URL : GET http://localhost:3000/api/admin/dashboard/stats
// route pour récupérer les statistiques du dashboard (films soumis, approuvés, rejetés, en attente)
router.get('/dashboard/stats',
    verifyToken,          // 1. Vérification connexion
    checkRole('admin'),   // 2. Vérification rôle Admin
    adminController.getDashboardStats // 3. Récupération des stats
);

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
// route pour afficher les playlists avec films et jurys assignés
router.get('/jury-lists',
    verifyToken,
    checkRole('admin'),
    adminController.getJuryListsWithAssignments
);
// route pour supprimer une playlist
router.delete('/jury-list/:id',
    verifyToken,
    checkRole('admin'),
    adminController.deleteJuryList
);
// route pour supprimer plusieurs playlists
router.delete('/jury-lists',
    verifyToken,
    checkRole('admin'),
    adminController.deleteManyJuryLists
);
// route qui assigne un film a une play list
router.post('/assigne-film',
    verifyToken,
    checkRole('admin'),
    adminController.addMovieToPlayList);

// route qui retire un film d'une play list
router.delete('/assigne-film',
    verifyToken,
    checkRole('admin'),
    adminController.removeMovieFromPlaylist);

// route qui assigne les jurys aux films
router.post('/assigne-jury',
    verifyToken,
    checkRole('admin'),
    adminController.assignedJuryToPlaylist);

// route pour recuperer les films candidats finalistes (votes jury)
router.get('/finalists',
    verifyToken,
    checkRole('admin'),
    finalistController.getFinalistCandidates);

// route pour mettre à jour la sélection et le prix d'un finalist
// Body : { is_selected: true/false, award_winner: 'Nom du prix' }
router.put('/finalists/:submissionId',
    verifyToken,
    checkRole('admin'),
    finalistController.updateFinalistSelection);

// route qui retire un jury d'une playlist
router.delete('/assigne-jury',
    verifyToken,
    checkRole('admin'),
    adminController.removeJuryFromPlaylist);

module.exports = router;

