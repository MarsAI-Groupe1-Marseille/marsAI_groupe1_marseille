const { Submission, Director, Collaborator } = require('../models');
const { uploadVideoToYoutube,uploadSubtitlesToYoutube } = require('../services/youtubeService');
const { validateUploadedFilesBySignature, cleanupUploadedFiles } = require('../services/fileValidationService');
const emailService = require('../services/emailService');
const { Op } = require('sequelize'); 
const fs = require('fs');
const crypto = require('crypto'); // C'est natif dans Node.js
const { sendErrorResponse } = require('../utils/errorHandler');

// Fonction pour normaliser gallery_urls en array JSON
const normalizeGalleryUrls = (submission) => {
  if (submission && submission.gallery_urls) {
    if (typeof submission.gallery_urls === 'string') {
      try {
        submission.gallery_urls = JSON.parse(submission.gallery_urls);
      } catch (e) {
        console.warn('Erreur lors du parsing de gallery_urls:', e);
        submission.gallery_urls = [];
      }
    }
    // Si c'est déjà un array, rien à faire
  }
  return submission;
};

// Création d'une nouvelle soumission (film) avec gestion des fichiers et YouTube
exports.createSubmission = async (req, res) => {
    const MODE_TEST_YOUTUBE = false; 

    console.log("Réception d'une nouvelle soumission (Version Scaleway S3)...");

    // 1. VÉRIFICATION DES FICHIERS (Multer-S3 les a déjà envoyés sur S3 à ce stade)
    if (!req.files || !req.files.video_file || !req.files.poster_file) {
        return res.status(400).json({ message: "Erreur : La vidéo et l'affiche sont obligatoires." });
    }

    // Avec Multer-S3, on utilise .location pour avoir l'URL complète et .key pour le nom sur le bucket
    const videoFile = req.files.video_file[0];
    const posterFile = req.files.poster_file[0];
    const subtitleFile = req.files.subtitle_file ? req.files.subtitle_file[0] : null;
    const galleryFiles = req.files.gallery_files || [];

    try {
        // Validation forte du contenu reel (signature binaire) des fichiers deja uploades sur S3.
        const signatureValidation = await validateUploadedFilesBySignature(req.files);
        if (!signatureValidation.ok) {
            await cleanupUploadedFiles(req.files);
            return res.status(400).json({
                message: 'Fichier invalide.',
                error: signatureValidation.message,
                errors: [{
                    field: signatureValidation.field || 'file',
                    message: signatureValidation.message
                }]
            });
        }

        // --- ÉTAPE 1 : GESTION DU RÉALISATEUR ---
        let director = await Director.findOne({ where: { email: req.body.director_email } });

        let socialLinksData = null;
        if (req.body.director_social_links) {
            try { socialLinksData = JSON.parse(req.body.director_social_links); } catch (e) {}
        }

        if (!director) {
            director = await Director.create({
                civility: req.body.director_civility || 'M',
                first_name: req.body.director_firstname,
                last_name: req.body.director_lastname,
                birth_date: req.body.director_birth_date,
                email: req.body.director_email,
                phone: req.body.director_phone,
                mobile: req.body.director_mobile,
                address: req.body.director_address,
                zip_code: req.body.director_zip_code,
                city: req.body.director_city,
                country: req.body.director_country,
                job_title: req.body.director_job_title,
                social_links: socialLinksData, 
                marketing_source: req.body.director_marketing_source,
                newsletter_optin: req.body.director_newsletter === 'true'
            });
        }

        // --- ÉTAPE 2 : YOUTUBE (Stream depuis S3) ---
        let youtubeId;
        if (MODE_TEST_YOUTUBE) {
            youtubeId = "FAKE_ID_" + Date.now(); 
        } else {
            console.log("Upload YouTube en cours via Stream S3...");
            // On passe la KEY du fichier S3 (ex: videos/123.mp4) au lieu du path local
            youtubeId = await uploadVideoToYoutube(
                videoFile.key, 
                req.body.title_original, 
                req.body.synopsis_original
            );

            // SI un fichier de sous-titres a été fourni, on l'envoie
            if (subtitleFile && youtubeId) {
                // On l'envoie de manière asynchrone (sans attendre pour ne pas ralentir la réponse client)
                // Ou avec un petit délai car YouTube a besoin de quelques secondes pour créer l'entrée vidéo
                setTimeout(async () => {
                    try {
                        await uploadSubtitlesToYoutube(youtubeId, subtitleFile.key, req.body.language_main || 'fr');
                    } catch (err) {
                        console.error("Échec envoi sous-titres:", err);
                    }
                }, 5000); // 5 secondes de délai par sécurité
}
        }

        // --- ÉTAPE 3 : PRÉPARATION GALERIE ---
        // On récupère les URLs Scaleway directes
        const galleryUrls = galleryFiles.map(file => file.location);

        // --- ÉTAPE 4 : CRÉATION DU FILM (Submission) ---
        const newSubmission = await Submission.create({
            director_id: director.id,
            title_original: req.body.title_original,
            title_english: req.body.title_english,
            synopsis_original: req.body.synopsis_original,
            synopsis_english: req.body.synopsis_english,
            duration_seconds: req.body.duration_seconds || 0,
            language_main: req.body.language_main,
            theme_tags: req.body.theme_tags,
            ai_classification: req.body.ai_classification,
            ai_tools: req.body.ai_tools,
            ai_methodology: req.body.ai_methodology,
            edit_token: crypto.randomBytes(32).toString('hex'),

            // Nouveaux champs S3
            youtube_id: youtubeId,
            s3_video_key: videoFile.key, // On stocke la clé pour pouvoir la retrouver sur S3
            poster_url: posterFile.location, // URL complète https://...
            gallery_urls: galleryUrls,
            subtitles_url: subtitleFile ? subtitleFile.location : null,
            has_subtitles: !!subtitleFile,

            video_status: MODE_TEST_YOUTUBE ? 'ready' : 'processing',
            approval_status: 'submitted'
        });

        // --- ÉTAPE 5 : COLLABORATEURS (Inchangé, ton code était déjà bon) ---
        if (req.body.collaborators_json) {
            try {
                const collaboratorsData = JSON.parse(req.body.collaborators_json);
                if (Array.isArray(collaboratorsData) && collaboratorsData.length > 0) {
                    const collaboratorsWithId = collaboratorsData.map(collab => ({
                        ...collab,
                        submission_id: newSubmission.id
                    }));
                    await Collaborator.bulkCreate(collaboratorsWithId);
                }
            } catch (error) {
                console.error("Erreur Collaborators :", error.message);
            }
        }

        // --- ÉTAPE 6 : ENVOI EMAIL DE CONFIRMATION ---
        try {
            await emailService.sendSubmissionConfirmation(
                { email: director.email },
                req.body.title_original
            );
        } catch (emailError) {
            console.error("Erreur envoi email confirmation:", emailError);
            // On ne bloque pas la soumission si l'email échoue
        }

        res.status(201).json({
            message: "Film enregistré avec succès sur S3 et YouTube !",
            submission_id: newSubmission.id,
            youtube_id: youtubeId
        });

    } catch (error) {
        console.error("Erreur Soumission :", error);
        await cleanupUploadedFiles(req.files);
        // Note : Pas besoin de fs.unlinkSync ici, car les fichiers sont sur S3.
        // On pourrait ajouter une fonction de nettoyage S3 en cas d'erreur si besoin.
        return sendErrorResponse(res, 500, error, 'Erreur lors de la création de la soumission.');
    }
};

// Récupération de tous les films avec pagination, recherche et filtrage par catégorie (thème)  pour la galerie 
exports.getAllSubmissions = async (req, res) => {
    try {
        // --- 1. RÉCUPÉRATION DES PARAMÈTRES (QUERY PARAMS) ---
        // Le front enverra : /api/submissions?page=1&limit=6&search=avatar&genre=SF&lang=fr&status=approved
        
        const page = parseInt(req.query.page) || 1;       // Page par défaut : 1
        const limit = parseInt(req.query.limit) || 9;     // Films par page par défaut : 9
        const search = req.query.search || '';            // Recherche titre
        const genre = req.query.genre || '';              // Filtre par genre/thème
        const status = req.query.status || '';            // Filtre par statut (approved, rejected, submitted)
        const lang = req.query.lang || 'fr';              // Langue pour le filtre : 'fr' ou 'en'

        // Calcul de l'offset (combien de films on saute)
        // Ex: Page 2 avec limite 9 -> on saute les 9 premiers ((2-1) * 9 = 9)
        const offset = (page - 1) * limit;

        // --- 2. CONSTRUCTION DE LA REQUÊTE (WHERE) ---
        const whereCondition = {};

        // Si une recherche textuelle est présente
        // On filtre selon la langue (fr = title_original, en = title_english)
        if (search) {
            const searchField = lang === 'en' ? 'title_english' : 'title_original';
            whereCondition[searchField] = { [Op.like]: `%${search}%` };
        }

        // Si un filtre de genre est présent (ex: "Horreur")
        if (genre) {
            whereCondition.theme_tags = { [Op.like]: `%${genre}%` };
        }

        // Si un filtre de statut est présent (ex: "approved", "rejected", "submitted")
        if (status) {
            whereCondition.approval_status = status;
        }

        // --- 3. EXÉCUTION DE LA REQUÊTE ---
        // findAndCountAll est magique : il renvoie les données ET le nombre total
        const { count, rows } = await Submission.findAndCountAll({
            where: whereCondition,
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']], // Du plus récent au plus vieux
            include: [{
                model: Director,
                attributes: ['first_name', 'last_name'] // Optimisation : on ne prend que le nécessaire
            }],
            distinct: true // Important pour avoir le bon compte avec les includes
        });

        // Normaliser gallery_urls pour chaque film
        rows.forEach(row => normalizeGalleryUrls(row));

        // --- 4. RÉPONSE FORMÉE POUR LE FRONT ---
        res.status(200).json({
            data: rows,           // Les films de la page actuelle
            totalItems: count,    // Nombre total de films (ex: 50)
            totalPages: Math.ceil(count / limit), // Nombre total de pages (ex: 6)
            currentPage: page     // Page actuelle
        });

    } catch (error) {
        console.error("Erreur récupération galerie :", error);
        res.status(500).json({ message: "Impossible de récupérer les films." });
    }
};


/**
 * 3. RÉCUPÉRER UN FILM PAR SON ID (Pour la page Détail)
 * Là, on veut TOUT : Réalisateur complet, Collaborateurs, etc.
 */
exports.getSubmissionById = async (req, res) => {
    const id = req.params.id; // L'ID qui vient de l'URL (/api/submissions/12)

    try {
        const submission = await Submission.findByPk(id, {
            include: [
                {
                    model: Director,
                    // Ici on prend tout le réalisateur car c'est la page détail
                },
                {
                    model: Collaborator,
                    // On récupère aussi tous les collaborateurs liés à ce film
                }
            ]
        });

        if (!submission) {
            return res.status(404).json({ message: "Film introuvable." });
        }

        // Normaliser gallery_urls pour assurer la cohérence
        normalizeGalleryUrls(submission);

        res.status(200).json(submission);
    } catch (error) {
        console.error(`Erreur récupération film ${id} :`, error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération du détail." });
    }
};

/**
 * 4. RÉCUPÉRER TOUS LES GENRES UNIQUES
 * Route optimisée pour récupérer uniquement les genres sans pagination
 */
exports.getAllGenres = async (req, res) => {
    try {
        // Récupère tous les films avec uniquement le champ theme_tags
        const submissions = await Submission.findAll({
            attributes: ['theme_tags'],
            where: {
                theme_tags: { [Op.ne]: null } // Ignore les valeurs null
            },
            raw: true
        });

        // Utilise flatMap pour extraire et aplatir tous les genres en une seule opération
        const allGenres = submissions
            .filter(sub => sub.theme_tags && sub.theme_tags.trim() !== '')
            .flatMap(sub => sub.theme_tags.split(',').map(tag => tag.trim()))
            .filter(tag => tag !== '');

        // Élimine les doublons avec Set et trie alphabétiquement
        const genres = [...new Set(allGenres)].sort();

        res.status(200).json({ genres });
    } catch (error) {
        console.error('Erreur récupération genres :', error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des genres." });
    }
};

/**
 * 5. RÉCUPÉRER LES FILMS SIMILAIRES PAR TAGS
 * Route pour afficher les films similaires sur la page de détail
 * Retourne max 10 films (le frontend en choisira 3 aléatoires)
 */
exports.getSimilarSubmissions = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Récupérer le film actuel pour extraire ses tags
        const currentSubmission = await Submission.findByPk(id, {
            attributes: ['id', 'theme_tags', 'approval_status']
        });

        if (!currentSubmission) {
            return res.status(404).json({ message: "Film introuvable." });
        }

        // 2. Extraire et normaliser les tags
        const currentTags = currentSubmission.theme_tags
            ? currentSubmission.theme_tags.split(',').map(tag => tag.trim().toLowerCase())
            : [];

        if (currentTags.length === 0) {
            return res.status(200).json({ similar: [] });
        }

        // 3. Chercher tous les films approuvés (sauf celui-ci) par tags similaires
        const allSubmissions = await Submission.findAll({
            where: {
                id: { [Op.ne]: id } // Exclure le film actuel
                // approval_status: 'approved' // Uniquement approuvés
            },
            attributes: ['id', 'title_original', 'title_english', 'poster_url', 'theme_tags'],
            include: [
                {
                    model: Director,
                    attributes: ['id', 'first_name', 'last_name']
                }
            ],
            raw: false
        });

        // 4. Calculer un score de similarité pour chaque film
        const similarFilms = allSubmissions
            .map(submission => {
                const submissionTags = submission.theme_tags
                    ? submission.theme_tags.split(',').map(tag => tag.trim().toLowerCase())
                    : [];

                // Compter les tags en commun
                const commonTags = submissionTags.filter(tag => currentTags.includes(tag)).length;
                
                return {
                    ...submission.toJSON ? submission.toJSON() : submission,
                    similarityScore: commonTags
                };
            })
            .filter(sub => sub.similarityScore > 0) // Garder uniquement ceux avec au moins un tag commun
            .sort((a, b) => b.similarityScore - a.similarityScore) // Trier par pertinence décroissante
            .slice(0, 10); // Max 10 films (le frontend en choisira 3 aléatoires)

        res.status(200).json({ similar: similarFilms });
    } catch (error) {
        console.error(`Erreur récupération films similaires pour ${id}:`, error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des films similaires." });
    }
};
