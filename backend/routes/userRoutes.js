const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { createValidatedSingleUploadHandler } = require('../middlewares/validatedUploadMiddleware');
const { validateRequest } = require('../middlewares/validationMiddleware');
const { csrfProtection } = require('../middlewares/csrfMiddleware');
const { forgotPasswordLimiter, uploadLimiter } = require('../middlewares/securityMiddleware');
const { 
    createUserValidators, 
    activateAccountValidators 
} = require('../validators/userValidators');
const { 
    forgotPasswordValidators, 
    resetPasswordValidators 
} = require('../validators/authValidators');

// Avatar: parse local, verifier signature, puis uploader sur S3.
const handleAvatarUpload = createValidatedSingleUploadHandler('avatar');


router.get('/', 
    verifyToken,                        // 1. Vérification connexion
    checkRole('admin', 'moderator'),    // 2. Vérification rôle Admin ou Modérateur
    userController.getAllUsers
);

router.get('/:id', 
    verifyToken,                        // 1. Vérification connexion
    checkRole('admin', 'moderator'),    // 2. Vérification rôle Admin ou Modérateur
    userController.getUserById
);

// Cette ligne permet à l'Admin de modifier le rôle d'un utilisateur (jury, admin, modérateur), son nom complet, son email ou son avatar
router.put('/:id',
    verifyToken,          // 1. Vérification connexion
    checkRole('admin'),   // 2. Vérification rôle Admin
    csrfProtection,       // 3. Protection CSRF
    handleAvatarUpload,   // 4. Upload avatar avec validation signature
    userController.updateUser
);

// Cette ligne permet à l'Admin de supprimer un utilisateur (ex: un jury qui ne fait plus partie du projet)
router.delete('/:id',
    verifyToken,          // 1. Vérification connexion
    checkRole('admin'),   // 2. Vérification rôle Admin
    csrfProtection,       // 3. Protection CSRF
    userController.deleteUser
);

// Cette ligne permet à l'Admin de créer et inviter un utilisateur (jury, admin, modérateur)
router.post('/invite', 
    verifyToken,
    checkRole('admin'),
    csrfProtection,
    createUserValidators,
    validateRequest,
    userController.createUser
);

// Cette ligne permet à l'utilisateur de demander une réinitialisation de mot de passe
router.post('/forgotpass', 
    forgotPasswordLimiter,
    csrfProtection,
    forgotPasswordValidators,
    validateRequest,
    userController.forgotPassword
);

// route pour activer le compte et définir le mot de passe (après invitation ou réinitialisation)
router.post('/active-compte', 
    uploadLimiter,
    csrfProtection,
    handleAvatarUpload,
    activateAccountValidators,
    validateRequest,
    userController.activateAccount
);

// Cette ligne permet à l'utilisateur de réinitialiser son mot de passe avec un token
router.post('/reset-password', 
    csrfProtection,
    resetPasswordValidators,
    validateRequest,
    userController.resetPassword
);

module.exports = router;