const { JuryEvaluation, JuryList, Submission, JuryMember, JuryListSubmission, User } = require('../models');
const { Op } = require('sequelize');

// ===============================================================
// ===============================================================
exports.getAllJury = async (req, res) => {
    try {
        // ÉTAPE 1 : On demande à la base de données de chercher les admins ET les jurys
        const juryMembers = await User.findAll({
            where: {
                // Op.in permet de chercher plusieurs valeurs en même temps
                role: { [Op.in]: ['jury', 'admin'] } 
            },
            // ÉTAPE 2 : On liste les colonnes qu'on veut récupérer
            attributes: ['id', 'full_name', 'email', 'avatar_url', 'specialite', 'role', 'created_at'],
            raw: true
        });

        // ÉTAPE 3 : On renvoie la liste complète au Front-end
        res.status(200).json({ success: true, juryMembers });
    } catch (error) {
        console.error('Erreur récupération jurys:', error);
        res.status(500).json({ error: error.message });
    }
};
// ===============================================================
// ===============================================================
// exports.getAllJury = async (req, res) => {
//     try {
//         const juryMembers = await User.findAll({
//             where: {
//                 role: 'jury'             },
//             attributes: ['id', 'full_name', 'email', 'avatar_url', 'specialite', 'role', 'created_at'],
//             raw: true
//         });

//         res.status(200).json({ success: true, juryMembers });
//     } catch (error) {
//         console.error('Erreur récupération jurys:', error);
//         res.status(500).json({ error: error.message });
//     }
// };

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
        const votes = await JuryEvaluation.findAll({ 
            where: { user_id: userId },
            attributes: ['id', 'submission_id', 'vote_status', 'comment', 'created_at']
        });
        res.json({ success: true, votes });
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