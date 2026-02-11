const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { route } = require('./authRoutes');


// const authMiddleware = require('../middlewares/authMiddleware'); // Vérifie si connecté
// const roleMiddleware = require('../middlewares/roleMiddleware'); // Vérifie si Admin

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
// Cette ligne permet à l'Admin de créer et inviter un utilisateur (jury, admin, modérateur)
router.post('/invite', userController.createUser);
// Cette ligne permet au jury de définir son mot de passe via le lien magique
router.post('/reset-password', userController.resetPassword);

module.exports = router;