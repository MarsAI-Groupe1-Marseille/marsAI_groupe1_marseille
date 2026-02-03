const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    // TODO: 1. Récupérer email et password du req.body
    // TODO: 2. Chercher le User par email (User.findOne)
    // TODO: 3. Si user n'existe pas -> erreur 401
    // TODO: 4. Comparer le password (bcrypt.compare)
    // TODO: 5. Si ok, générer un Token JWT (jwt.sign)
    // TODO: 6. Renvoyer le token au client
};

exports.googleCallback = async (req, res) => {
    // TODO: Géré par Passport, ici on renvoie juste le token final ou une redirection
};



  