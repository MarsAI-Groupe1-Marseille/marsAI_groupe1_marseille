const express = require('express');
const router = express.Router();
const awardController = require('../controllers/awardController');
const { generalLimiter } = require('../middlewares/securityMiddleware');

/**
 * Route publique - Récupérer tous les films lauréats
 * GET /api/awards
 */
router.get('/', generalLimiter, awardController.getAwards);

module.exports = router;
