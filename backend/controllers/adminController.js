// 1. On importe les modèles nécessaires
const { sequelize, Submission, ModerationTicket, Director, JuryList, JuryListSubmission, JuryMember, User } = require('../models');
const { Op } = require('sequelize'); 
// 2. On importe le service d'emailing pour envoyer les notifications aux réalisateurs
const emailService = require('../services/emailService');

// Fonction pour récupérer les statistiques du dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        // Compter les soumissions par statut d'approbation
        const totalSubmissions = await Submission.count();
        const approvedCount = await Submission.count({ 
            where: { approval_status: 'approved' } 
        });
        const rejectedCount = await Submission.count({ 
            where: { approval_status: 'rejected' } 
        });
        const pendingCount = await Submission.count({ 
            where: { approval_status: { [Op.in]: ['submitted', 'incomplete'] } } 
        });

        res.status(200).json({
            totalSubmissions,
            approved: approvedCount,
            rejected: rejectedCount,
            pending: pendingCount
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
        res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
};

// 3. On implémente la logique de modération dans une seule fonction
exports.moderateSubmission = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { submissionId } = req.params;
        const { status, issue_type, description } = req.body;
        
        // L'ID de l'admin connecté
        const adminId = req.user ? req.user.id : 1;

        // =========================================================
        // On inclut le modèle DIRECTOR
        // =========================================================
        const film = await Submission.findByPk(submissionId, {
            include: [{ model: Director }] // Sequelize va chercher les infos du réalisateur
        });

        if (!film) {
            await transaction.rollback();
            return res.status(404).json({ message: "Film introuvable." });
        }

        // --- CAS 1 : APPROUVÉ ---
        if (status === 'approved') {
            await film.update({ approval_status: 'approved' }, { transaction });
            await transaction.commit();

            // Envoi de l'email au DIRECTOR
            // Note : Sequelize met le résultat dans film.Director (avec majuscule par défaut)
            if (film.Director && film.Director.email) {
                // On adapte l'objet pour qu'il ait un 'username' compatible avec emailService
                const directorData = {
                    email: film.Director.email,
                    username: film.Director.last_name || "Cinéaste"
                };
                await emailService.sendFilmApproved(directorData, film.title_original);
            }

            return res.status(200).json({ message: "Film approuvé.", film });
        }

        // --- CAS 2 : REFUSÉ ---
        else if (status === 'rejected') {
            if (!issue_type || !description) {
                await transaction.rollback();
                return res.status(400).json({ message: "Motif et description requis." });
            }

            await film.update({ approval_status: 'rejected' }, { transaction });

            await ModerationTicket.create({
                submission_id: submissionId,
                admin_id: adminId, // L'admin qui a refusé
                issue_type,
                description,
                is_resolved: true
            }, { transaction });

            await transaction.commit();

            // Envoi de l'email au DIRECTOR
            if (film.Director && film.Director.email) {
                const directorData = {
                    email: film.Director.email,
                    username: film.Director.last_name || "Cinéaste"
                };
                await emailService.sendFilmRefused(directorData, film.title_original, description);
            }

            return res.status(200).json({ message: "Film refusé.", ticket: { issue_type } });
        }
        
        else {
            await transaction.rollback();
            return res.status(400).json({ message: "Statut invalide." });
        }

    } catch (error) {
        await transaction.rollback();
        console.error("Erreur Modération :", error);
        res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
};

// Fonction pour créer une nouvelle liste de jury
exports.createJuryList = async (req, res) => {
    try {
        /**
         * Extrait la propriété 'name' du corps de la requête
         * @param {Object} req - L'objet requête Express
         * @param {Object} req.body - Le corps de la requête contenant les données du formulaire
         * @param {string} req.body.name - Le nom envoyé par le client
         * @returns {string} name - Le nom extrait du corps de la requête
         */
        const { name } = req.body;
        // Vérifie que le nom a bien été fourni
        if (!name) {
            return res.status(400).json({ message: "Le nom de la liste de jury est requis." });
        }
        // Création de la liste de jury dans la base de données
        const juryList = await JuryList.create({ name });
        res.status(201).json({
            message: "Liste de jury créée avec succès.",
            juryList
        });
    } catch (error) {
        console.error("Erreur lors de la création de la liste de jury :", error);
        res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
};

// Fonction pour récupérer les playlists avec films et jurys assignés
exports.getJuryListsWithAssignments = async (req, res) => {
    try {
        const juryLists = await JuryList.findAll({
            include: [
                {
                    model: Submission,
                    attributes: ['id', 'title_original', 'duration_seconds'],
                    through: { attributes: [] }
                },
                {
                    model: User,
                    attributes: ['id', 'full_name', 'email', 'role'],
                    through: { attributes: [] },
                    where: { role: 'jury' },
                    required: false
                }
            ],
            order: [['created_at', 'DESC']]
        });

        const payload = juryLists.map(list => {
            const filmsCount = list.Submissions ? list.Submissions.length : 0;
            const juryCount = list.Users ? list.Users.length : 0;

            return {
                id: list.id,
                name: list.name,
                status: filmsCount > 0 ? 'active' : 'draft',
                filmsCount,
                juryCount,
                films: list.Submissions || [],
                jury: list.Users || []
            };
        });

        res.status(200).json({ playlists: payload });
    } catch (error) {
        console.error("Erreur lors de la récupération des playlists :", error);
        res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
};
// Fonction pour ajouter un film à une liste de jury
exports.addMovieToPlayList = async (req, res) =>{
    try {
        const{jury_list_id ,submission_id} = req.body;
        if(!jury_list_id || !submission_id){
            return res.status(400).json({ message: "jury_list_id et submission_id est requis" });
        }

        // Vérifier que la liste de jury existe
        const juryList = await JuryList.findByPk(jury_list_id);
        if (!juryList) {
            return res.status(404).json({ message: "La liste de jury avec l'ID " + jury_list_id + " n'existe pas." });
        }

        // Vérifier que le film (submission) existe
        const submission = await Submission.findByPk(submission_id);
        if (!submission) {
            return res.status(404).json({ message: "Le film avec l'ID " + submission_id + " n'existe pas." });
        }

        await JuryListSubmission.create({jury_list_id,submission_id});
        res.status(201).json({ message: "film assigné a la playlist avec id:"+jury_list_id+" "+" créée avec succès." });
            
        
    } catch (error) {
         console.error("Erreur lors lors de l'assignation ddu film a la playlist :", error);
        res.status(500).json({ message: "Erreur serveur.", error: error.message });
        
    }

};
// Fonction pour assigner un jury à une liste de jury
exports.assignedJuryToPlaylist = async (req, res) =>{
    try {
        const{jury_list_id , user_id } = req.body;
        if(!jury_list_id || !user_id){
            return res.status(400).json({ message: "jury_list_id et user_id sont requis" });
        }

        // Vérifier que la liste de jury existe
        const juryList = await JuryList.findByPk(jury_list_id);
        if (!juryList) {
            return res.status(404).json({ message: "La liste de jury avec l'ID " + jury_list_id + " n'existe pas." });
        }

        // Vérifier que l'utilisateur existe
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: "L'utilisateur avec l'ID " + user_id + " n'existe pas." });
        }

        // Vérifier que l'utilisateur a bien le rôle "jury"
        if (user.role !== 'jury') {
            return res.status(403).json({ message: "L'utilisateur avec l'ID " + user_id + " n'a pas le rôle de jury. Rôle actuel: " + user.role });
        }

        await JuryMember.create({jury_list_id,user_id});
        res.status(201).json({ message: "jury avec id:"+user_id+" "+" assigné a la playlist avec id:"+jury_list_id+" "+" créée avec succès." });
        
    }
    catch(error){
        console.error('Erreur lors de l\'assignation du jury à la playlist :', error);
        res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
};

// Fonction pour retirer un film d'une playlist
exports.removeMovieFromPlaylist = async (req, res) => {
    try {
        const { jury_list_id, submission_id } = req.body;

        if (!jury_list_id || !submission_id) {
            return res.status(400).json({ message: "jury_list_id et submission_id sont requis" });
        }

        const deletedCount = await JuryListSubmission.destroy({
            where: { jury_list_id, submission_id }
        });

        if (!deletedCount) {
            return res.status(404).json({ message: "Aucune assignation trouvée." });
        }

        res.status(200).json({ message: "Film retiré de la playlist." });
    } catch (error) {
        console.error("Erreur lors du retrait du film :", error);
        res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
};

// Fonction pour retirer un jury d'une playlist
exports.removeJuryFromPlaylist = async (req, res) => {
    try {
        const { jury_list_id, user_id } = req.body;

        if (!jury_list_id || !user_id) {
            return res.status(400).json({ message: "jury_list_id et user_id sont requis" });
        }

        const deletedCount = await JuryMember.destroy({
            where: { jury_list_id, user_id }
        });

        if (!deletedCount) {
            return res.status(404).json({ message: "Aucune assignation trouvée." });
        }

        res.status(200).json({ message: "Jury retiré de la playlist." });
    } catch (error) {
        console.error("Erreur lors du retrait du jury :", error);
        res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
};

// Supprimer une playlist (avec ses liaisons)
exports.deleteJuryList = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { id } = req.params;

        if (!id) {
            await transaction.rollback();
            return res.status(400).json({ message: "L'id de la playlist est requis." });
        }

        const juryList = await JuryList.findByPk(id);
        if (!juryList) {
            await transaction.rollback();
            return res.status(404).json({ message: "Playlist introuvable." });
        }

        await JuryListSubmission.destroy({ where: { jury_list_id: id }, transaction });
        await JuryMember.destroy({ where: { jury_list_id: id }, transaction });
        await JuryList.destroy({ where: { id }, transaction });

        await transaction.commit();
        return res.status(200).json({ message: "Playlist supprimée." });
    } catch (error) {
        await transaction.rollback();
        console.error("Erreur lors de la suppression de la playlist :", error);
        res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
};

// Supprimer plusieurs playlists (avec leurs liaisons)
exports.deleteManyJuryLists = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ message: "La liste des ids est requise." });
        }

        await JuryListSubmission.destroy({ where: { jury_list_id: ids }, transaction });
        await JuryMember.destroy({ where: { jury_list_id: ids }, transaction });
        const deletedCount = await JuryList.destroy({ where: { id: ids }, transaction });

        await transaction.commit();
        return res.status(200).json({ message: "Playlists supprimées.", deletedCount });
    } catch (error) {
        await transaction.rollback();
        console.error("Erreur lors de la suppression des playlists :", error);
        res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
};