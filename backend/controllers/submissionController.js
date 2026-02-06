const { Submission, Director, Collaborator } = require('../models');
const { uploadVideoToYoutube } = require('../services/youtubeService');
const { Op } = require('sequelize'); 
const fs = require('fs');
const crypto = require('crypto'); // C'est natif dans Node.js

// Création d'une nouvelle soumission (film) avec gestion des fichiers et YouTube
exports.createSubmission = async (req, res) => {
    // A 'true' POUR TESTER SANS YOUTUBE
    const MODE_TEST_YOUTUBE = false; // Passe à 'true' pour simuler l'upload YouTube sans faire de requête réelle

    console.log("Réception d'une nouvelle soumission (Version Complète)...");

    // 1. VÉRIFICATION DES FICHIERS
    if (!req.files || !req.files.video_file || !req.files.poster_file) {
        return res.status(400).json({ message: "Erreur : La vidéo et l'affiche sont obligatoires." });
    }

    const videoFile = req.files.video_file[0];
    const posterFile = req.files.poster_file[0];
    const subtitleFile = req.files.subtitle_file ? req.files.subtitle_file[0] : null;
    const galleryFiles = req.files.gallery_files || [];

    try {
        // --- ÉTAPE 1 : GESTION DU RÉALISATEUR (Director) ---
        // On vérifie s'il existe déjà par email
        let director = await Director.findOne({ where: { email: req.body.director_email } });

        // Parsing des réseaux sociaux (si envoyés en JSON string depuis Insomnia)
        let socialLinksData = null;
        if (req.body.director_social_links) {
            try {
                socialLinksData = JSON.parse(req.body.director_social_links);
            } catch (e) {
                console.warn("Format JSON invalide pour social_links", e);
            }
        }

        if (!director) {
            console.log("Création du réalisateur...");
            director = await Director.create({
                // Identité
                civility: req.body.director_civility || 'M',
                first_name: req.body.director_firstname,
                last_name: req.body.director_lastname,
                birth_date: req.body.director_birth_date, // Format YYYY-MM-DD

                // Contact
                email: req.body.director_email,
                phone: req.body.director_phone,
                mobile: req.body.director_mobile, // Obligatoire selon ton modèle

                // Adresse
                address: req.body.director_address,
                zip_code: req.body.director_zip_code,
                city: req.body.director_city,
                country: req.body.director_country,

                // Pro
                job_title: req.body.director_job_title,
                social_links: socialLinksData, 
                marketing_source: req.body.director_marketing_source,
                newsletter_optin: req.body.director_newsletter === 'true'
            });
        }

        // --- ÉTAPE 2 : YOUTUBE (Fake ou Réel) ---
        let youtubeId;
        if (MODE_TEST_YOUTUBE) {
            console.log("MODE TEST YOUTUBE ACTIVÉ");
            youtubeId = "FAKE_ID_" + Date.now(); 
        } else {
            console.log("Upload YouTube en cours...");
            youtubeId = await uploadVideoToYoutube(
                videoFile.path, 
                req.body.title_original, 
                req.body.synopsis_original
            );
            // Suppression de la vidéo locale après upload réussi
            if (fs.existsSync(videoFile.path)) fs.unlinkSync(videoFile.path);
        }

        // --- ÉTAPE 3 : PRÉPARATION GALERIE ---
        const galleryUrls = galleryFiles.map(file => `/uploads/${file.filename}`);

        // --- ÉTAPE 4 : CRÉATION DU FILM (Submission) ---
        const newSubmission = await Submission.create({
            director_id: director.id,
            
            // Titres & Textes
            title_original: req.body.title_original,
            title_english: req.body.title_english,
            synopsis_original: req.body.synopsis_original,
            synopsis_english: req.body.synopsis_english,

            // Technique
            duration_seconds: req.body.duration_seconds || 0,
            language_main: req.body.language_main,
            theme_tags: req.body.theme_tags, // Peut être une string "Drame, Guerre"

            // IA
            ai_classification: req.body.ai_classification, // '100% IA' ou 'Hybrid'
            ai_tools: req.body.ai_tools,
            ai_methodology: req.body.ai_methodology,

            // Sécurité (Token unique pour édition future)
            edit_token: crypto.randomBytes(32).toString('hex'),

            // Fichiers & YouTube
            youtube_id: youtubeId, // Ton modèle attend l'ID, pas l'URL complète
            poster_url: `/uploads/${posterFile.filename}`,
            gallery_urls: galleryUrls, // Sequelize gère le JSON array
            has_subtitles: !!subtitleFile, // true si fichier présent, false sinon

            // Statuts
            video_status: MODE_TEST_YOUTUBE ? 'ready' : 'processing',
            approval_status: 'submitted'
        });

        // --- ÉTAPE 5 : CRÉATION DES COLLABORATEURS ---
        // Dans Insomnia/FormData, on envoie un tableau d'objets sous forme de TEXTE JSON
        // Champ: "collaborators_json" -> Valeur: '[{"role":"Monteur", "first_name":"Bob"}, ...]'
        if (req.body.collaborators_json) {
            try {
                const collaboratorsData = JSON.parse(req.body.collaborators_json);
                
                if (Array.isArray(collaboratorsData) && collaboratorsData.length > 0) {
                    console.log(`Ajout de ${collaboratorsData.length} collaborateurs...`);
                    
                    // On ajoute l'ID de la submission à chaque collaborateur
                    const collaboratorsWithId = collaboratorsData.map(collab => ({
                        ...collab,
                        submission_id: newSubmission.id, // Liaison avec le film
                        //  les champs devraient correspondre au modèle Collaborator
                        role: collab.role,
                        first_name: collab.first_name,
                        last_name: collab.last_name,
                        email: collab.email,
                        job_title: collab.job_title,
                        civility: collab.civility
                    }));

                    // BulkCreate est plus performant pour ajouter une liste
                    await Collaborator.bulkCreate(collaboratorsWithId);
                }
            } catch (error) {
                console.error("Erreur format JSON Collaborators :", error.message);
                // On ne bloque pas la soumission pour ça, mais on log l'erreur
            }
        }

        // --- RÉPONSE ---
        res.status(201).json({
            message: "Film et collaborateurs ajoutés avec succès !",
            submission_id: newSubmission.id,
            director: director.last_name,
            youtube_id: youtubeId
        });

    } catch (error) {
        console.error("Erreur Soumission :", error);
        // Nettoyage fichiers en cas de crash
        if (req.files) {
            Object.values(req.files).flat().forEach(file => {
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        }
        res.status(500).json({ message: "Erreur serveur.", error: error.message });
    }
};

// Récupération de tous les films avec pagination, recherche et filtrage par catégorie (thème)  pour la galerie 
exports.getAllSubmissions = async (req, res) => {
    try {
        // --- 1. RÉCUPÉRATION DES PARAMÈTRES (QUERY PARAMS) ---
        // Le front enverra : /api/submissions?page=1&limit=6&search=avatar&genre=SF
        
        const page = parseInt(req.query.page) || 1;       // Page par défaut : 1
        const limit = parseInt(req.query.limit) || 9;     // Films par page par défaut : 9
        const search = req.query.search || '';            // Recherche titre
        const genre = req.query.genre || '';              // Filtre par genre/thème

        // Calcul de l'offset (combien de films on saute)
        // Ex: Page 2 avec limite 9 -> on saute les 9 premiers ((2-1) * 9 = 9)
        const offset = (page - 1) * limit;

        // --- 2. CONSTRUCTION DE LA REQUÊTE (WHERE) ---
        const whereCondition = {};

        // Si une recherche textuelle est présente (Titre original ou Anglais)
        if (search) {
            whereCondition[Op.or] = [
                { title_original: { [Op.like]: `%${search}%` } }, // % permet de chercher "au milieu"
                { title_english: { [Op.like]: `%${search}%` } }
            ];
        }

        // Si un filtre de genre est présent (ex: "Horreur")
        if (genre) {
            whereCondition.theme_tags = { [Op.like]: `%${genre}%` };
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

        res.status(200).json(submission);
    } catch (error) {
        console.error(`Erreur récupération film ${id} :`, error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération du détail." });
    }
};