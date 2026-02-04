const express = require('express');
const router = express.Router();

// Imports
// const submissionController = require('../controllers/submissionController');
// const upload = require('../middlewares/upload'); // middleware Multer

router.get('/', (req, res) => {
    res.send('Submission routes are working!');
});

module.exports = router;