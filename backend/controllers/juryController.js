const { JuryEvaluation, JuryList, Submission, JuryMember, JuryListSubmission, User, sequelize } = require('../models');
const { Op, QueryTypes } = require('sequelize');
const { sendErrorResponse } = require('../utils/errorHandler');
const logger = require('../config/logger');


// Récupérer tous les jurys avec leurs statistiques de votes et le nombre de films assignés
exports.getAllJury = async (req, res) => {
    try {
        const juryMembers = await User.findAll({
            where: {
                role: 'jury'
            },
            attributes: ['id', 'full_name', 'email', 'avatar_url', 'specialite', 'role', 'created_at'],
            raw: true
        });

        res.status(200).json({ success: true, juryMembers });
    } catch (error) {
        logger.error('Erreur recuperation jurys', { error: error.message, stack: error.stack });
        return sendErrorResponse(res, 500, error, 'Erreur lors de la récupération des jurys.');
    }
};

// Récupérer tous les jurys avec leurs statistiques de votes, le nombre de films assignés et les stats globales
exports.getAllJuryWithStats = async (req, res) => {
    try {
        const [juryMembers, assignedCounts, evaluationStats, approvedFilmsCount] = await Promise.all([
            User.findAll({
                where: { role: 'jury' },
                attributes: ['id', 'full_name', 'email', 'avatar_url', 'specialite', 'role', 'created_at'],
                raw: true
            }),
            sequelize.query(
                `SELECT jm.user_id, COUNT(DISTINCT jls.submission_id) AS assigned_count
                 FROM jury_members jm
                 INNER JOIN jury_list_submissions jls ON jm.jury_list_id = jls.jury_list_id
                 GROUP BY jm.user_id`,
                { type: QueryTypes.SELECT }
            ),
            sequelize.query(
                `SELECT jm.user_id, je.vote_status, COUNT(DISTINCT je.submission_id) AS count
                 FROM jury_members jm
                 INNER JOIN jury_list_submissions jls ON jm.jury_list_id = jls.jury_list_id
                 INNER JOIN jury_evaluations je
                   ON je.user_id = jm.user_id
                  AND je.submission_id = jls.submission_id
                 GROUP BY jm.user_id, je.vote_status`,
                { type: QueryTypes.SELECT }
            ),
            Submission.count({ where: { approval_status: 'approved' } })
        ]);

        const assignedByUser = assignedCounts.reduce((acc, row) => {
            acc[row.user_id] = Number(row.assigned_count);
            return acc;
        }, {});

        const statsByUser = evaluationStats.reduce((acc, row) => {
            const userId = row.user_id;
            if (!acc[userId]) {
                acc[userId] = { like: 0, dislike: 0, discuss: 0 };
            }
            if (row.vote_status === 'LIKE') {
                acc[userId].like = Number(row.count);
            } else if (row.vote_status === 'DISLIKE') {
                acc[userId].dislike = Number(row.count);
            } else if (row.vote_status === 'DISCUSS') {
                acc[userId].discuss = Number(row.count);
            }
            return acc;
        }, {});

        const juryMembersWithStats = juryMembers.map((member) => {
            const stats = statsByUser[member.id] || { like: 0, dislike: 0, discuss: 0 };
            const votesCast = stats.like + stats.dislike + stats.discuss;
            const approvalRate = votesCast > 0 ? Math.round((stats.like / votesCast) * 100) : 0;
            const totalFilms = assignedByUser[member.id] || 0;

            return {
                ...member,
                stats: {
                    like: stats.like,
                    dislike: stats.dislike,
                    discuss: stats.discuss,
                    votes_cast: votesCast,
                    total_films: totalFilms,
                    pending: Math.max(0, totalFilms - votesCast),
                    approval_rate: approvalRate
                }
            };
        });

        const totalAssigned = Object.values(assignedByUser).reduce((sum, count) => sum + count, 0);
        const totalLikes = Object.values(statsByUser).reduce((sum, s) => sum + s.like, 0);
        const totalDislikes = Object.values(statsByUser).reduce((sum, s) => sum + s.dislike, 0);
        const totalDiscuss = Object.values(statsByUser).reduce((sum, s) => sum + s.discuss, 0);
        const totalVotes = totalLikes + totalDislikes + totalDiscuss;
        const totalProgress = totalAssigned > 0 ? Math.round((totalVotes / totalAssigned) * 100) : 0;

        const globalStats = {
            jury_count: juryMembers.length,
            approved_films: approvedFilmsCount,
            total_progress: totalProgress,
            films_liked: totalLikes,
            films_disliked: totalDislikes,
            films_discuss: totalDiscuss,
            total_assigned: totalAssigned,
            total_votes: totalVotes
        };

        res.status(200).json({ success: true, juryMembers: juryMembersWithStats, globalStats });
    } catch (error) {
        logger.error('Erreur recuperation jurys avec stats', { error: error.message, stack: error.stack });
        return sendErrorResponse(res, 500, error, 'Erreur lors de la récupération des jurys avec statistiques.');
    }
};

// Soumettre ou mettre à jour un vote pour une soumission donnée par le jury connecté (Upsert)
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
        return sendErrorResponse(res, 500, error, "Erreur lors de l'enregistrement du vote.");
    }
};

// Récupérer les votes du jury connecté pour les films qu'il a évalués, avec pagination
exports.getJuryVotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const votes = await JuryEvaluation.findAll({ 
            where: { user_id: userId },
            attributes: ['id', 'submission_id', 'vote_status', 'comment', 'created_at']
        });
        res.json({ success: true, votes });
    } catch (error) {
        return sendErrorResponse(res, 500, error, 'Erreur lors de la récupération des votes.');
    }
};

// Récupérer les playlists du jury connecté avec les films associés et leurs évaluations (si existantes)
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
                    where: {
                        approval_status: 'approved' // Filtrer uniquement les films approuvés
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

        // Récupérer toutes les évaluations du jury connecté
        const myEvaluations = await JuryEvaluation.findAll({
            where: { user_id: userId },
            attributes: ['submission_id', 'vote_status', 'comment', 'created_at'],
            raw: true
        });

        // Créer une map submission_id => evaluation pour accès rapide
        const evaluationsMap = myEvaluations.reduce((acc, evaluation) => {
            acc[evaluation.submission_id] = evaluation;
            return acc;
        }, {});

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
                    videos: playlist.Submissions.map(sub => {
                        const myEvaluation = evaluationsMap[sub.id];
                        return {
                            id: sub.id,
                            title: sub.title_original,
                            duration_seconds: sub.duration_seconds,
                            youtubeId: sub.youtube_id,
                            poster: sub.poster_url,
                            director: sub.Director ? { 
                                first_name: sub.Director.first_name,
                                last_name: sub.Director.last_name,
                                full_name: `${sub.Director.first_name} ${sub.Director.last_name}`
                            } : null,
                            // Ajouter l'évaluation du jury connecté s'il existe
                            my_evaluation: myEvaluation ? {
                                vote_status: myEvaluation.vote_status,
                                comment: myEvaluation.comment,
                                created_at: myEvaluation.created_at
                            } : null
                        };
                    })
                });
            }
        }

        res.status(200).json({ success: true, playlists: myPlaylists });
    } catch (error) {
        logger.error('Erreur recuperation playlists jury', { userId: req.user?.id, error: error.message, stack: error.stack });
        return sendErrorResponse(res, 500, error, 'Erreur lors de la récupération des playlists du jury.');
    }
};