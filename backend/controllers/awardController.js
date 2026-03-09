const { Submission, Director } = require('../models');
const { Op } = require('sequelize');
const { sendErrorResponse } = require('../utils/errorHandler');

/**
 * Mapper le nom du prix vers un type pour le frontend
 */
const getAwardType = (awardName) => {
  if (!awardName) return 'special';
  
  const name = awardName.toLowerCase();
  
  if (name.includes('grand prix') || name.includes('grand prize')) {
    return 'grand_prix';
  } else if (name.includes('jury')) {
    return 'jury';
  } else if (name.includes('public') || name.includes('audience')) {
    return 'public';
  } else {
    return 'special';
  }
};

/**
 * Récupérer tous les films sélectionnés avec un prix pour la page palmarès
 * GET /api/awards
 */
exports.getAwards = async (req, res) => {
  try {
    // Récupérer les films avec is_selected = true ET award_winner non null
    const winners = await Submission.findAll({
      where: {
        is_selected: true,
        award_winner: {
          [Op.ne]: null
        },
        approval_status: 'approved'
      },
      include: [{
        model: Director,
        attributes: ['first_name', 'last_name']
      }],
      attributes: [
        'id',
        'title_original',
        'title_english',
        'poster_url',
        'duration_seconds',
        'youtube_id',
        'award_winner'
      ],
      order: [['created_at', 'DESC']]
    });

    // Formater les données pour le frontend palmares.jsx
    const formattedAwards = winners.map((submission) => {
      const directorFirstName = submission.Director?.first_name || '';
      const directorLastName = submission.Director?.last_name || '';
      const directorName = `${directorFirstName} ${directorLastName}`.trim() || 'Unknown';

      return {
        id: submission.id,
        award_name: submission.award_winner,
        award_type: getAwardType(submission.award_winner),
        film: {
          id: submission.id,
          title: submission.title_original,
          title_english: submission.title_english,
          director: directorName,
          poster_url: submission.poster_url,
          duration: submission.duration_seconds,
          youtube_id: submission.youtube_id
        }
      };
    });

    res.json({
      success: true,
      awards: formattedAwards
    });
  } catch (error) {
    console.error('Error fetching awards:', error);
    return sendErrorResponse(res, 500, error, 'Erreur lors de la récupération des lauréats');
  }
};
