const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', authController.login);

router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
    passport.authenticate('google', { session: false }), 
    authController.googleCallback
);

// Route pour récupérer les infos de l'utilisateur connecté
router.get('/me', authMiddleware.verifyToken, authController.getMe);

module.exports = router;