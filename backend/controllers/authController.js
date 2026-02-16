const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        //Renvoyer les infos de base au client (sans le token en réponse)
        res.json({
            message:"Connexion réussie.",
            user: {
                id: user.id,
                full_name: user.full_name,
                role: user.role
            }
        }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.googleCallback = async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('http://localhost:5173/login?error=auth_failed');
        }

        const token = jwt.sign(
            { id: req.user.id, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 
        });

        const redirectUrl = req.user.role === 'admin' 
            ? 'http://localhost:5173/dashboard' 
            : 'http://localhost:5173/';

        res.redirect(redirectUrl);

    } catch (error) {
        res.redirect('http://localhost:5173/login?error=server_error');
    }
};
exports.getMe = async (req, res) => {
    // req.user a été rempli par ton authMiddleware
    // On renvoie juste les informations de l'utilisateur au Front-end
    res.json({
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.full_name,
        role: req.user.role
    });
};
