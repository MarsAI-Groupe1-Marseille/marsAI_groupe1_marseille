const { body, param } = require('express-validator');

// ===== SUBMIT VOTE VALIDATORS =====
const submitVoteValidators = [
    body('submissionId')
        .isInt({ min: 1 }).withMessage('ID film invalide'),
    body('vote_status')
        .notEmpty().withMessage('Vote requis')
        .isIn(['LIKE', 'DISLIKE', 'DISCUSS']).withMessage('Vote invalide'),
    body('comment')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Commentaire : max 1000 caractères')
        .escape()
];

module.exports = {
    submitVoteValidators
};
