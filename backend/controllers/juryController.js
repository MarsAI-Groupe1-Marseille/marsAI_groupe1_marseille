const { JuryEvaluation } = require('../models');

exports.submitVote = async (req, res) => {
    try {
        const { submissionId, vote_status, comment } = req.body;
        const userId = req.user.id; // Récupéré via le middleware d'auth

        // On cherche si une évaluation existe déjà pour ce juré et ce film
        const [evaluation, created] = await JuryEvaluation.findOrCreate({
            where: { user_id: userId, submission_id: submissionId },
            defaults: { vote_status, comment }
        });

        // Si elle existait déjà, on la met à jour (Upsert)
        if (!created) {
            evaluation.vote_status = vote_status;
            evaluation.comment = comment;
            await evaluation.save();
        }

        res.status(200).json({ 
            message: created ? "Vote enregistré !" : "Vote mis à jour !",
            evaluation 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getJuryVotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const votes = await JuryEvaluation.findAll({ where: { UserId: userId } });
        res.json(votes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};