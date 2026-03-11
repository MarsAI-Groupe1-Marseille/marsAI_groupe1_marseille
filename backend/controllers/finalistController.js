const { sequelize, JuryEvaluation, Submission, User } = require('../models');
const { QueryTypes } = require('sequelize');
const { sendErrorResponse } = require('../utils/errorHandler');
const logger = require('../config/logger');
// Helper pour parser les entiers positifs avec une valeur de fallback
const parsePositiveInt = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
        return fallback;
    }
    return parsed;
};
// Helper pour résoudre le filtre de vote en fonction de la query string
const resolveVoteFilter = (raw) => {
    const normalized = (raw || 'liked_or_discuss').toLowerCase();
    if (normalized === 'liked') return ['LIKE'];
    if (normalized === 'discuss') return ['DISCUSS'];
    if (normalized === 'liked_or_discuss') return ['LIKE', 'DISCUSS'];
    if (normalized === 'all') return null;
    return ['LIKE', 'DISCUSS'];
};
// Récupérer les candidats finalistes avec pagination, filtrage par vote et sélection
exports.getFinalistCandidates = async (req, res) => {
    try {
        const page = parsePositiveInt(req.query.page, 1);
        const limit = parsePositiveInt(req.query.limit, 12);
        const offset = (page - 1) * limit;
        const voteFilter = resolveVoteFilter(req.query.vote);
        const includeSelected = req.query.includeSelected === 'true';
        const selectedOnly = req.query.selectedOnly === 'true';

        const whereClauses = [];
        const replacements = {
            limit,
            offset
        };

        // Filtrer TOUJOURS par approval_status = 'approved'
        whereClauses.push('s.approval_status = :approvalStatus');
        replacements.approvalStatus = 'approved';

        if (!includeSelected && !selectedOnly) {
            whereClauses.push('s.is_selected = 0');
        }

        if (selectedOnly) {
            whereClauses.push('s.is_selected = 1');
        }

        const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
        // Si un filtre de vote est appliqué, on utilise HAVING pour filtrer les soumissions qui ont au moins un vote correspondant
        const havingSql = voteFilter
            ? `HAVING SUM(CASE WHEN je.vote_status IN (${voteFilter.map((v, i) => `:vote${i}`).join(', ')}) THEN 1 ELSE 0 END) > 0`
            : 'HAVING COUNT(je.id) > 0';

        if (voteFilter) {
            voteFilter.forEach((status, index) => {
                replacements[`vote${index}`] = status;
            });
        }
        // Requête SQL pour récupérer les soumissions avec les stats de votes et les infos du réalisateur, en appliquant les filtres et la pagination
        const dataQuery = `
            SELECT
                s.id,
                s.title_original,
                s.synopsis_original,
                s.theme_tags,
                s.poster_url,
                s.is_selected,
                s.award_winner,
                s.approval_status,
                s.created_at,
                d.first_name AS director_first_name,
                d.last_name AS director_last_name,
                SUM(CASE WHEN je.vote_status = 'LIKE' THEN 1 ELSE 0 END) AS like_count,
                SUM(CASE WHEN je.vote_status = 'DISLIKE' THEN 1 ELSE 0 END) AS dislike_count,
                SUM(CASE WHEN je.vote_status = 'DISCUSS' THEN 1 ELSE 0 END) AS discuss_count,
                COUNT(je.id) AS total_votes
            FROM submissions s
            INNER JOIN jury_evaluations je ON je.submission_id = s.id
            LEFT JOIN directors d ON d.id = s.director_id
            ${whereSql}
            GROUP BY
                s.id,
                s.title_original,
                s.synopsis_original,
                s.theme_tags,
                s.poster_url,
                s.is_selected,
                s.award_winner,
                s.approval_status,
                s.created_at,
                d.first_name,
                d.last_name
            ${havingSql}
            ORDER BY total_votes DESC, s.created_at DESC
            LIMIT :limit OFFSET :offset
        `;
        // Requête SQL pour compter le nombre total de soumissions correspondant aux filtres (sans pagination)
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM (
                SELECT s.id
                FROM submissions s
                INNER JOIN jury_evaluations je ON je.submission_id = s.id
                ${whereSql}
                GROUP BY s.id
                ${havingSql}
            ) AS filtered
        `;
    // Exécuter les deux requêtes en parallèle pour optimiser les performances
        const [rows, countRows] = await Promise.all([
            sequelize.query(dataQuery, { replacements, type: QueryTypes.SELECT }),
            sequelize.query(countQuery, { replacements, type: QueryTypes.SELECT })
        ]);

        const totalItems = countRows.length ? Number(countRows[0].total) : 0;
        const totalPages = Math.ceil(totalItems / limit);
        const submissionIds = rows.map((row) => row.id);

        const evaluations = submissionIds.length
            ? await JuryEvaluation.findAll({
                where: { submission_id: submissionIds },
                include: [{
                    model: User,
                    attributes: ['id', 'full_name', 'avatar_url']
                }],
                attributes: ['id', 'submission_id', 'vote_status', 'comment', 'created_at'],
                order: [['created_at', 'DESC']]
            })
            : [];
        // Organiser les évaluations par submission_id pour les associer facilement aux soumissions dans la réponse
        const evaluationsBySubmission = evaluations.reduce((acc, evaluation) => {
            const submissionId = evaluation.submission_id;
            if (!acc[submissionId]) {
                acc[submissionId] = [];
            }
            acc[submissionId].push({
                id: evaluation.id,
                vote_status: evaluation.vote_status,
                comment: evaluation.comment,
                created_at: evaluation.created_at,
                user: evaluation.User
                    ? {
                        id: evaluation.User.id,
                        full_name: evaluation.User.full_name,
                        avatar_url: evaluation.User.avatar_url
                    }
                    : null
            });
            return acc;
        }, {});
        // Assembler la réponse finale en combinant les données des soumissions et leurs évaluations associées
        const data = rows.map((row) => ({
            id: row.id,
            title_original: row.title_original,
            synopsis_original: row.synopsis_original,
            theme_tags: row.theme_tags,
            poster_url: row.poster_url,
            is_selected: !!row.is_selected,
            award_winner: row.award_winner,
            approval_status: row.approval_status,
            created_at: row.created_at,
            director: {
                first_name: row.director_first_name,
                last_name: row.director_last_name,
                full_name: [row.director_first_name, row.director_last_name].filter(Boolean).join(' ')
            },
            vote_stats: {
                like: Number(row.like_count) || 0,
                dislike: Number(row.dislike_count) || 0,
                discuss: Number(row.discuss_count) || 0,
                total: Number(row.total_votes) || 0
            },
            evaluations: evaluationsBySubmission[row.id] || []
        }));

        res.status(200).json({
            data,
            totalItems,
            totalPages,
            currentPage: page,
            filter: {
                vote: req.query.vote || 'liked_or_discuss',
                includeSelected,
                selectedOnly,
                approval_status: 'approved'
            }
        });
    } catch (error) {
        logger.error('Erreur recuperation finalistes', { error: error.message, stack: error.stack });
        return sendErrorResponse(res, 500, error, 'Erreur lors de la récupération des candidats finalistes.');
    }
};
// Mettre à jour la sélection d'un finaliste (is_selected et award_winner)
exports.updateFinalistSelection = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { is_selected, award_winner } = req.body;

        if (!submissionId) {
            return res.status(400).json({ message: 'ID de soumission requis.' });
        }

        const submission = await Submission.findByPk(submissionId);
        if (!submission) {
            return res.status(404).json({ message: 'Film introuvable.' });
        }

        // Mettre à jour is_selected et award_winner
        const update = {};
        if (typeof is_selected === 'boolean') {
            update.is_selected = is_selected;
            // Si on désélectionne le film, on efface aussi le prix
            if (!is_selected) {
                update.award_winner = null;
            }
        }
        if (award_winner !== undefined) {
            update.award_winner = award_winner || null;
        }

        await submission.update(update);

        res.status(200).json({
            message: 'Film mis à jour avec succès.',
            submission: {
                id: submission.id,
                is_selected: submission.is_selected,
                award_winner: submission.award_winner
            }
        });
    } catch (error) {
        logger.error('Erreur mise a jour finalist', {
            submissionId: req.params.submissionId,
            error: error.message,
            stack: error.stack
        });
        return sendErrorResponse(res, 500, error, 'Erreur lors de la mise à jour de la sélection du finaliste.');
    }
};
