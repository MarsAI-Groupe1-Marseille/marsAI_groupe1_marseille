// 1. On importe les modèles nécessaires
const { sequelize, Submission, ModerationTicket, Director, JuryList, JuryListSubmission } = require('../models');
// 2. On importe le service d'emailing pour envoyer les notifications aux réalisateurs
const emailService = require('../services/emailService');

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
        await JuryList.create({ name });
        res.status(201).json({ message: "Liste de jury créée avec succès." });
    } catch (error) {
        console.error("Erreur lors de la création de la liste de jury :", error);
        res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
};