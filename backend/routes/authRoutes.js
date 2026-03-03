const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { strictLoginLimiter } = require('../middlewares/securityMiddleware');
const { csrfProtection } = require('../middlewares/csrfMiddleware');
const { validateRequest } = require('../middlewares/validationMiddleware');
const { loginValidators } = require('../validators/authValidators');

router.post('/login', 
    strictLoginLimiter,
    csrfProtection,
    loginValidators,
    validateRequest,
    authController.login
);

router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
    passport.authenticate('google', { 
        session: false,
        failureRedirect: 'http://localhost:5173/login?error=not_invited' 
    }), 
    authController.googleCallback
);

router.get('/me', verifyToken, authController.getMe);

module.exports = router;