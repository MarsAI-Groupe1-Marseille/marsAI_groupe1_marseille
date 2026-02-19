const { User } = require('../models');
const emailService = require('../services/emailService');
const crypto = require('crypto');
 const bcrypt = require('bcrypt');

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
        const resetLink = `http://localhost:5173/active-compte?token=${token}`;
        
        // On appelle le service d'emailing adapté au rôle.
        await emailService.sendUserInvitation(email, full_name, role, resetLink);

        res.status(201).json({ 
            message: "Invitation envoyée avec succès !", 
            userId: newUser.id 
        });

    } catch (error) {
        // Capture les erreurs comme un email déjà existant (contrainte unique en BDD).
        res.status(500).json({ error: error.message });
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
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

        // Mettre à jour l'utilisateur avec le token (utiliser l'instance directement)
        user.invite_token = resetToken;
        user.invite_token_expires_at = expiresAt;
        await user.save();

        // Construire le lien de réinitialisation
        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

        // Envoyer l'email avec le lien
        await emailService.sendResetPasswordEmail(email, user.full_name || 'utilisateur', resetLink);

        res.status(200).json({ 
            message: "Si cet email existe, un lien de réinitialisation a été envoyé." 
        });

    } catch (error) {
        console.error("Erreur forgotPassword :", error);
        res.status(500).json({ error: error.message });
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
            { password_hash, invite_token: null, invite_token_expires_at: null },
            { where: { invite_token: token } }
        );

        res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Activation du compte après invitation (définition du mot de passe et éventuellement upload d'avatar)
exports.activateAccount = async (req, res) => {
    try {
        const { token, new_password, specialite } = req.body;
        const avatar = req.file ? req.file.path : null;
        if (!token || !new_password) {
            return res.status(400).json({ error: "Le token et le nouveau mot de passe sont requis." });
        }
        const user = await User.findOne({ where: { invite_token: token } });
        if (!user) {
            return res.status(404).json({ error: "Token invalide ou expiré." });
        }
        const password_hash = await bcrypt.hash(new_password, 10);
        user.password_hash = password_hash;
        user.invite_token = null;
        user.invite_token_expires_at = null;
        user.avatar_url = avatar;
        
        // Gérer specialite : s'il vient du frontend en tant que string, le convertir en array
        if (specialite) {
            // Si c'est une string, la mettre dans un array ; sinon, garder le array
            user.specialite = typeof specialite === 'string' ? [specialite] : specialite;
        }
        await user.save();

        res.status(200).json({ message: "Compte activé avec succès." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/**
 * RÉCUPÉRER TOUS LES UTILISATEURS
 * Route utilitaire pour l'administration.
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            // On exclut les données sensibles par sécurité
            attributes: { exclude: ['password_hash', 'invite_token'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * RÉCUPÉRER UN UTILISATEUR PAR ID
 */
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password_hash', 'invite_token'] }
        });
        
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        // Mise à jour des champs si ils sont fournis
        if(!full_name && !role && !email) {
            return res.status(400).json({ error: 'Au moins un champ (full_name, role, email) doit être fourni pour la mise à jour.' });
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
        await user.save();
        res.json({ message: 'Utilisateur mis à jour avec succès', user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role
        } });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
    }
};