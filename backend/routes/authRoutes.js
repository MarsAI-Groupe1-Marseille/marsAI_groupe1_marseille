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
    passport.authenticate('google', { 
        session: false,
        failureRedirect: 'http://localhost:5174/login?error=not_invited' 
    }), 
    authController.googleCallback
);

router.get('/me', authMiddleware.verifyToken, authController.getMe);

module.exports = router;