const { JuryEvaluation, JuryList, Submission, JuryMember, JuryListSubmission } = require('../models');

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

exports.getMyPlaylists = async (req, res) => {
    try {
        const userId = req.user.id;

        // Récupérer les playlists (JuryList) associées au jury
        const playlists = await JuryList.findAll({
            include: [
                {
                    model: Submission,
                    through: { 
                        attributes: [] // On ne veut pas les attributs de la table de jointure
                    },
                    include: [
                        {
                            model: require('../models').Director,
                            attributes: ['id', 'first_name', 'last_name']
                        }
                    ],
                    attributes: ['id', 'title_original', 'duration_seconds', 'youtube_id', 'poster_url', 'director_id']
                }
            ]
        });

        // Filtrer les playlists qui contiennent ce jury (via JuryMember)
        const myPlaylists = [];
        for (const playlist of playlists) {
            const isMember = await JuryMember.findOne({
                where: { 
                    user_id: userId, 
                    jury_list_id: playlist.id 
                }
            });

            if (isMember) {
                myPlaylists.push({
                    id: playlist.id,
                    name: playlist.name,
                    videos: playlist.Submissions.map(sub => ({
                        id: sub.id,
                        title: sub.title_original,
                        duration_seconds: sub.duration_seconds,
                        youtubeId: sub.youtube_id,
                        poster: sub.poster_url,
                        director: sub.Director ? { 
                            first_name: sub.Director.first_name,
                            last_name: sub.Director.last_name,
                            full_name: `${sub.Director.first_name} ${sub.Director.last_name}`
                        } : null
                    }))
                });
            }
        }

        res.status(200).json({ success: true, playlists: myPlaylists });
    } catch (error) {
        console.error('Erreur récupération playlists:', error);
        res.status(500).json({ error: error.message });
    }
};