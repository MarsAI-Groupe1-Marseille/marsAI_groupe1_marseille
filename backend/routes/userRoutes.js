const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { route } = require('./authRoutes');


// const authMiddleware = require('../middlewares/authMiddleware'); // Vérifie si connecté
// const roleMiddleware = require('../middlewares/roleMiddleware'); // Vérifie si Admin

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

module.exports = router;