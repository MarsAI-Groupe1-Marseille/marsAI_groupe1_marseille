const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { validateRequest } = require('../middlewares/validationMiddleware');
const { forgotPasswordLimiter, uploadLimiter } = require('../middlewares/securityMiddleware');
const { 
    createUserValidators, 
    activateAccountValidators 
} = require('../validators/userValidators');
const { 
    forgotPasswordValidators, 
    resetPasswordValidators 
} = require('../validators/authValidators');


router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

// Cette ligne permet à l'Admin de modifier le rôle d'un utilisateur (jury, admin, modérateur) ou son nom complet ou son email
router.put('/:id',
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
router.post('/invite', 
    verifyToken,
    checkRole('admin'),
    createUserValidators,
    validateRequest,
    userController.createUser
);

// Cette ligne permet à l'utilisateur de demander une réinitialisation de mot de passe
router.post('/forgotpass', 
    forgotPasswordLimiter,
    forgotPasswordValidators,
    validateRequest,
    userController.forgotPassword
);

// route pour activer le compte et définir le mot de passe (après invitation ou réinitialisation)
router.post('/active-compte', 
    uploadLimiter,
    upload.single('avatar'), 
    activateAccountValidators,
    validateRequest,
    userController.activateAccount
);

// Cette ligne permet à l'utilisateur de réinitialiser son mot de passe avec un token
router.post('/reset-password', 
    resetPasswordValidators,
    validateRequest,
    userController.resetPassword
);

module.exports = router;