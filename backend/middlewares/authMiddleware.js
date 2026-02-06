const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

// --- VÉRIFICATION DU TOKEN ---
const verifyToken = async (req, res, next) => {
    try {
        // Récupérer le token depuis les cookies HttpOnly
        const token = req.cookies.token;
        
        if (!token) return res.status(401).json({ message: "Token manquant." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);//Sequalize function

        if (!user) return res.status(401).json({ message: "Utilisateur introuvable." });

        req.user = user; // On stocke l'user pour la suite
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token invalide ou expiré." });
    }
};

// --- VÉRIFICATION DU RÔLE ---
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "Non authentifié." });

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Accès interdit. Rôle requis : ${allowedRoles.join(' ou ')}`
            });
        }
        next();
    };
};

module.exports = { verifyToken, checkRole };