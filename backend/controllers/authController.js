const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendErrorResponse } = require('../utils/errorHandler');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Gérer la connexion d'un utilisateur (email + password)
exports.login = async (req, res) => {
    try{
        const{ email, password } = req.body;
        //Chercher le User par email (via Sequelize
        const user = await User.findOne({where: { email }});
        
        if(!user) {
            return res.status(401).json({ message: "Identifiants invalides."});
        }
        //Comparer le password (bcrypt.compare)
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch){
            return res.status(401).json({ message: "Identifiants invalides."});
        }
        const token = jwt.sign(
            { id: user.id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: '24h'}
        );
        
        // Envoyer le token en HttpOnly Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'|| process.env.NODE_ENV === 'development',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        //Renvoyer les infos de base au client (sans le token en réponse)
        res.json({
            message:"Connexion réussie.",
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                avatar_url: user.avatar_url,
                account_status: user.account_status
            }
        }); 
    } catch (error) {
        return sendErrorResponse(res, 500, error, 'Erreur lors de la connexion.');
    }
};

// Gérer le callback de Google OAuth (après que l'utilisateur se soit connecté avec Google)
exports.googleCallback = async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
        }

        const token = jwt.sign(
            { id: req.user.id, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'|| process.env.NODE_ENV === 'development',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 
        });

        const redirectUrl = req.user.role === 'admin' || req.user.role === 'moderator'
            ? `${FRONTEND_URL}/dashboard`
            : req.user.role === 'jury'
            ? `${FRONTEND_URL}/dashboardJury`
            : `${FRONTEND_URL}/login?error=invalid_role`;

        res.redirect(redirectUrl);

    } catch (error) {
        res.redirect(`${FRONTEND_URL}/login?error=server_error`);
    }
};

// Récupérer les informations de l'utilisateur connecté (via le token JWT)
exports.getMe = async (req, res) => {
    // req.user a été rempli par ton authMiddleware
    // On renvoie juste les informations de l'utilisateur au Front-end
    res.json({
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.full_name,
        role: req.user.role,
        avatar_url: req.user.avatar_url,
        account_status: req.user.account_status
    });
};

// Gérer la déconnexion d'un utilisateur (en supprimant le cookie JWT)
exports.logout = async (req, res) => {
    try {
        // Effacer le cookie JWT
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({
            message: "Déconnexion réussie."
        });
    } catch (error) {
        return sendErrorResponse(res, 500, error, 'Erreur lors de la déconnexion.');
    }
};
