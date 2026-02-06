const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { route } = require('./authRoutes');


// const authMiddleware = require('../middlewares/authMiddleware'); // Vérifie si connecté
// const roleMiddleware = require('../middlewares/roleMiddleware'); // Vérifie si Admin

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
// Cette ligne permet à l'Admin d'envoyer une invitation
router.post('/invite-jury', userController.createJury);

module.exports = router;