const { User } = require('../models');
// const emailService = require('../services/emailService');
const crypto = require('crypto'); // Pour générer un token aléatoire

exports.createJury = async (req, res) => {
    try {
        // TODO: 1. Récupérer l'email et le nom depuis req.body
        // TODO: 2. Générer un token d'invitation (crypto.randomBytes)
        // TODO: 3. Créer le User en base avec role='jury' et invite_token=token
        // TODO: 4. Envoyer un email (emailService) contenant le lien: /reset-password?token=XYZ
        
        res.json({ message: "Invitation envoyée !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    // TODO: 1. Récupérer le token et le nouveau mot de passe
    // TODO: 2. Trouver le user qui a ce token
    // TODO: 3. Hasher le mot de passe (bcrypt.hash)
    // TODO: 4. Mettre à jour le user et vider le invite_token
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password_hash', 'invite_token'] } // Exclure les champs sensibles
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password_hash', 'invite_token'] } // Exclure les champs sensibles
        });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};