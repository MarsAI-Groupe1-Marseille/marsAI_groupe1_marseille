const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { route } = require('./authRoutes');
const upload = require('../middlewares/uploadMiddleware');


// const authMiddleware = require('../middlewares/authMiddleware'); // Vérifie si connecté
// const roleMiddleware = require('../middlewares/roleMiddleware'); // Vérifie si Admin

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
// Cette ligne permet à l'Admin de modifier le rôle d'un utilisateur (jury, admin, modérateur) ou son nom complet ou son email
router.put( '/:id',
     verifyToken,          // 1. Vérification connexion
    checkRole('admin'),   // 2. Vérification rôle Admin
    userController.updateUser
);
// Cette ligne permet à l'Admin de supprimer un utilisateur (ex: un jury qui ne fait plus partie du projet)
router.delete('/:id',
    verifyToken,          // 1. Vérification connexion
    checkRole('admin'),   // 2. Vérification rôle Admin
    userController.deleteUser
);
// Cette ligne permet à l'Admin de créer et inviter un utilisateur (jury, admin, modérateur)
router.post('/invite', userController.createUser);
// Cette ligne permet à l'utilisateur de demander une réinitialisation de mot de passe
router.post('/forgotpass', userController.forgotPassword);
// Cette ligne permet à l'utilisateur de réinitialiser son mot de passe avec un token
router.post('/reset-password', userController.resetPassword);

module.exports = router;