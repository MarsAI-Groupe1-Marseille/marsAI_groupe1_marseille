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
        
        //Renvoyer le token et les infos de base au client 
        res.json({
            message:"Connexion réussie.",
            token,
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
    if (!req.user) {
        return res.status(401).json({ message: "Authentification Google échouée." });
    }

    const token = jwt.sign(
        { id: req.user.id, role: req.user.role},
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        message: "Connexion Google réussie.",
        token,
        user: {
            id: req.user.id,
            full_name: req.user.full_name,
            role: req.user.role
        }
    });
};



  