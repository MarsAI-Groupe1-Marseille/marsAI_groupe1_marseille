const { sequelize, JuryEvaluation, Submission, User } = require('../models');
const { QueryTypes } = require('sequelize');

const parsePositiveInt = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
        return fallback;
    }
    return parsed;
};

const resolveVoteFilter = (raw) => {
    const normalized = (raw || 'liked_or_discuss').toLowerCase();
    if (normalized === 'liked') return ['LIKE'];
    if (normalized === 'discuss') return ['DISCUSS'];
    if (normalized === 'liked_or_discuss') return ['LIKE', 'DISCUSS'];
    if (normalized === 'all') return null;
    return ['LIKE', 'DISCUSS'];
};

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

        const havingSql = voteFilter
            ? `HAVING SUM(CASE WHEN je.vote_status IN (${voteFilter.map((v, i) => `:vote${i}`).join(', ')}) THEN 1 ELSE 0 END) > 0`
            : 'HAVING COUNT(je.id) > 0';

        if (voteFilter) {
            voteFilter.forEach((status, index) => {
                replacements[`vote${index}`] = status;
            });
        }

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
        console.error('Erreur recuperation finalistes:', error);
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
};

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
        console.error('Erreur mise à jour finalist:', error);
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
};
