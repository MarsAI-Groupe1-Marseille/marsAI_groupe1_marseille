const express = require('express');
const router = express.Router();
// const passport = require('passport'); // S'il fait Google Auth
const authController = require('../controllers/authController');
// const authMiddleware = require('../middlewares/authMiddleware'); // Pour vérifier le token


router.post('/login', authController.login);



module.exports = router;