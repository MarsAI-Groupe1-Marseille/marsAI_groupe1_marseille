const { User } = require('../models');
const emailService = require('../services/emailService');
const crypto = require('crypto');

/**
 * TICKET #74 : INVITATION D'UN MEMBRE DU JURY
 * Implémentation des TODOs 1 à 4 pour l'envoi d'invitation.
 */
exports.createJury = async (req, res) => {
    try {
        // 1. Récupération des données du formulaire (Body)
        // On extrait l'email et le nom complet envoyés par l'administrateur.
        const { email, full_name } = req.body;

        // Validation simple pour s'assurer que les données ne sont pas vides.
        if (!email || !full_name) {
            return res.status(400).json({ error: "L'email et le nom complet sont requis." });
        }

        // 2. Génération d'un jeton (token) de sécurité unique
        // On utilise 'crypto' pour créer une chaîne de 64 caractères aléatoires (hex).
        const token = crypto.randomBytes(32).toString('hex');

        // 3. Enregistrement en base de données
        // On crée l'utilisateur avec le rôle 'jury' et on stocke le token généré.
        // Le modèle 'User' possède bien le champ 'invite_token'.
        const newUser = await User.create({
            email: email,
            full_name: full_name,
            role: 'jury',
            invite_token: token
        });

        // 4. Construction du lien magique et envoi de l'email
        // Le lien renvoie vers le frontend avec le token en paramètre.
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;
        
        // On appelle le service d'emailing pour envoyer l'invitation.
        await emailService.sendJuryInvitation(email, "À définir via le lien", resetLink);

        res.status(201).json({ 
            message: "Invitation envoyée avec succès !", 
            userId: newUser.id 
        });

    } catch (error) {
        // Capture les erreurs comme un email déjà existant (contrainte unique en BDD).
        res.status(500).json({ error: error.message });
    }
};

/**
 * TODO : À RÉALISER DANS UN AUTRE TICKET
 * Logique de définition du mot de passe (Non implémentée pour l'instant).
 */
exports.resetPassword = async (req, res) => {
    // TODO: 1. Récupérer le token et le nouveau mot de passe
    // TODO: 2. Trouver le user qui a ce token
    // TODO: 3. Hasher le mot de passe (bcrypt.hash)
    // TODO: 4. Mettre à jour le user et vider le invite_token
    res.status(501).json({ message: "Fonctionnalité prévue dans le prochain ticket." });
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