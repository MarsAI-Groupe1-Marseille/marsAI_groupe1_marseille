const { User } = require('../models');
const emailService = require('../services/emailService');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sendErrorResponse } = require('../utils/errorHandler');
const { validateUploadedFilesBySignature, cleanupUploadedFiles } = require('../services/fileValidationService');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const resolveAccountStatus = (user) => {
    if (user.account_status === 'active' || user.account_status === 'pending') {
        return user.account_status;
    }
    return user.password_hash ? 'active' : 'pending';
};

const toSafeUser = (user) => {
    const plain = user.toJSON ? user.toJSON() : { ...user };
    plain.account_status = resolveAccountStatus(plain);
    delete plain.password_hash;
    delete plain.invite_token;
    return plain;
};

/**
 * TICKET #74 : INVITATION D'UN UTILISATEUR (Jury, Admin, Modérateur)
 * Implémentation générique pour créer tout type d'utilisateur avec invitation par email.
 */
exports.createUser = async (req, res) => {
    try {
        // 1. Récupération des données du formulaire (Body)
        // On extrait l'email, le nom complet et le rôle envoyés par l'administrateur.
        const { email, full_name, role } = req.body;

        // Validation simple pour s'assurer que les données ne sont pas vides.
        if (!email || !full_name || !role) {
            return res.status(400).json({ error: "L'email, le nom complet et le rôle sont requis." });
        }

        // Validation du rôle
        const allowedRoles = ['jury', 'admin', 'moderator'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ error: "Rôle invalide. Rôles acceptés : jury, admin, moderator." });
        }

        // 2. Génération d'un jeton (token) de sécurité unique
        // On utilise 'crypto' pour créer une chaîne de 64 caractères aléatoires (hex).
        const token = crypto.randomBytes(32).toString('hex');

        // 3. Enregistrement en base de données
        // On crée l'utilisateur avec le rôle spécifié et on stocke le token généré.
        // Le modèle 'User' possède bien le champ 'invite_token'.
        const newUser = await User.create({
            email: email,
            full_name: full_name,
            role: role,
            invite_token: token
        });

        // 4. Construction du lien magique et envoi de l'email
        // Le lien renvoie vers le frontend avec le token en paramètre.
        const resetLink = `${FRONTEND_URL}/active-compte?token=${token}`;
        
        // On appelle le service d'emailing adapté au rôle.
        await emailService.sendUserInvitation(email, full_name, role, resetLink);

        res.status(201).json({ 
            message: "Invitation envoyée avec succès !", 
            userId: newUser.id 
        });

    } catch (error) {
        // Gérer l'erreur de contrainte unique (email déjà utilisé)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ 
                error: "Cet email est déjà utilisé par un autre utilisateur." 
            });
        }
        
        // Autres erreurs
        console.error('Erreur création utilisateur:', error);
        res.status(500).json({ error: "Erreur lors de la création de l'utilisateur." });
    }
};

// Demande de réinitialisation de mot de passe (Oubli de mot de passe)
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "L'email est requis." });
        }

        // Chercher l'utilisateur par email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
            return res.status(200).json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });
        }

        // Générer un token unique
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Mettre à jour l'utilisateur avec le token (utiliser l'instance directement)
        user.invite_token = resetToken;
        user.invite_token_expires_at = expiresAt;
        await user.save();

        // Construire le lien de réinitialisation
        const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Envoyer l'email avec le lien
        await emailService.sendResetPasswordEmail(email, user.full_name || 'utilisateur', resetLink);

        res.status(200).json({ 
            message: "Si cet email existe, un lien de réinitialisation a été envoyé." 
        });

    } catch (error) {
        console.error("Erreur forgotPassword :", error);
        return sendErrorResponse(res, 500, error, 'Erreur lors de la demande de réinitialisation.');
    }
};

// Réinitialiser le mot de passe avec un token (depuis forgotpass)
exports.resetPassword = async (req, res) => {
    try {
        const { token, new_password } = req.body;

        // Validation des paramètres
        if (!token || !new_password) {
            return res.status(400).json({ error: "Le token et le nouveau mot de passe sont requis." });
        }

        // Vérifier l'existence du token
        const user = await User.findOne({ where: { invite_token: token } });
        if (!user) {
            return res.status(404).json({ error: "Token invalide ou expiré." });
        }

        if (user.invite_token_expires_at && user.invite_token_expires_at < new Date()) {
            return res.status(404).json({ error: "Token invalide ou expiré." });
        }

        // Hasher le nouveau mot de passe
        const password_hash = await bcrypt.hash(new_password, 10);

        // Mettre à jour l'utilisateur : définir le mot de passe et invalider le token
        await User.update(
            { password_hash, account_status: 'active', invite_token: null, invite_token_expires_at: null },
            { where: { invite_token: token } }
        );

        res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        return sendErrorResponse(res, 500, error, 'Erreur lors de la réinitialisation du mot de passe.');
    }
};
// Activation du compte après invitation (définition du mot de passe et éventuellement upload d'avatar)
exports.activateAccount = async (req, res) => {
    try {
        const { token, new_password, specialite } = req.body;
        
        if (!token || !new_password) {
            return res.status(400).json({ error: "Le token et le nouveau mot de passe sont requis." });
        }

        const user = await User.findOne({ where: { invite_token: token } });
        if (!user) {
            return res.status(404).json({ error: "Token invalide ou expiré." });
        }

        // Validation forte de l'avatar (signature binaire) si un fichier est uploadé.
        if (req.file) {
            const filesByField = { avatar: [req.file] };
            const signatureValidation = await validateUploadedFilesBySignature(filesByField);

            if (!signatureValidation.ok) {
                await cleanupUploadedFiles(filesByField);
                return res.status(400).json({
                    message: 'Fichier avatar invalide.',
                    error: signatureValidation.message,
                    errors: [{
                        field: signatureValidation.field || 'avatar',
                        message: signatureValidation.message
                    }]
                });
            }
        }

        // Avec multer-s3, utiliser req.file.location au lieu de req.file.path
        const avatar = req.file ? req.file.location : null;

        const password_hash = await bcrypt.hash(new_password, 10);
        user.password_hash = password_hash;
        user.account_status = 'active';
        user.invite_token = null;
        user.invite_token_expires_at = null;
        
        // Mise à jour de l'avatar seulement si un fichier a été uploadé
        if (avatar) {
            user.avatar_url = avatar;
        }
        
        // Gérer specialite : parser le JSON si c'est une string
        if (specialite) {
            try {
                // Le frontend envoie JSON.stringify(specialiteList), donc on doit parser
                user.specialite = typeof specialite === 'string' ? JSON.parse(specialite) : specialite;
            } catch (e) {
                // Si le parsing échoue, traiter comme un simple array avec une seule valeur
                user.specialite = [specialite];
            }
        }
        await user.save();

        res.status(200).json({ message: "Compte activé avec succès." });
    } catch (error) {
        // Évite les objets orphelins sur S3 si l'activation échoue après upload.
        if (req.file) {
            await cleanupUploadedFiles({ avatar: [req.file] });
        }
        return sendErrorResponse(res, 500, error, 'Erreur lors de l\'activation du compte.');
    }
};


/**
 * RÉCUPÉRER TOUS LES UTILISATEURS
 * Route utilitaire pour l'administration.
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            // invite_token ne doit jamais être exposé
            attributes: { exclude: ['invite_token'] }
        });
        res.json(users.map(toSafeUser));
    } catch (error) {
        return sendErrorResponse(res, 500, error, 'Erreur lors de la récupération des utilisateurs.');
    }
};

/**
 * RÉCUPÉRER UN UTILISATEUR PAR ID
 */
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['invite_token'] }
        });
        
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(toSafeUser(user));
    } catch (error) {
        return sendErrorResponse(res, 500, error, 'Erreur lors de la récupération de l\'utilisateur.');
    }
};

/**
 * METTRE À JOUR UN UTILISATEUR (ex: Changer le rôle ou le nom)
 * Cette route peut être utilisée par l'admin pour modifier les informations d'un utilisateur.
 */
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { full_name, role, email } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Validation forte de l'avatar uploadé (signature binaire).
        if (req.file) {
            const filesByField = { avatar: [req.file] };
            const signatureValidation = await validateUploadedFilesBySignature(filesByField);

            if (!signatureValidation.ok) {
                await cleanupUploadedFiles(filesByField);
                return res.status(400).json({
                    message: 'Fichier avatar invalide.',
                    error: signatureValidation.message,
                    errors: [{
                        field: signatureValidation.field || 'avatar',
                        message: signatureValidation.message
                    }]
                });
            }
        }

        // Mise à jour des champs si ils sont fournis
        if (!full_name && !role && !email && !req.file) {
            return res.status(400).json({ error: 'Au moins un champ (full_name, role, email, avatar) doit être fourni pour la mise à jour.' });
        }
        if (full_name) user.full_name = full_name;
        if (role) {
            const allowedRoles = ['jury', 'admin', 'moderator'];
            if (!allowedRoles.includes(role)) {
                return res.status(400).json({ error: "Rôle invalide. Rôles acceptés : jury, admin, moderator." });
            }
            user.role = role;
        }
        if (email) user.email = email;

        if (req.file?.location) {
            user.avatar_url = req.file.location;
        }

        user.account_status = resolveAccountStatus(user);

        await user.save();
        res.json({ message: 'Utilisateur mis à jour avec succès', user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            avatar_url: user.avatar_url,
            account_status: user.account_status
        } });
    } catch (error) {
        if (req.file) {
            await cleanupUploadedFiles({ avatar: [req.file] });
        }
        return sendErrorResponse(res, 500, error, 'Erreur lors de la mise à jour de l\'utilisateur.');
    }
};

/**
 * SUPPRIMER UN UTILISATEUR
 * Cette route peut être utilisée par l'admin pour supprimer un utilisateur (ex: un jury qui ne fait plus partie du projet).
 */
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        await user.destroy();
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        return sendErrorResponse(res, 500, error, 'Erreur lors de la suppression de l\'utilisateur.');
    }
};