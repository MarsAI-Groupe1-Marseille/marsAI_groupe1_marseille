const { Submission, Director, Collaborator } = require('../models/index');
// const youtubeService = require('../services/youtubeService');

exports.createSubmission = async (req, res) => {
    try {
        // TODO: 1. Vérifier req.files (Vidéo, Affiche)
        // TODO: 2. Upload vidéo vers YouTube (youtubeService.upload...)
        // TODO: 3. Find or Create le Director (avec email)
        // TODO: 4. Créer la Submission liée au Director et mettre l'ID YouTube
        // TODO: 5. Boucler sur req.body.collaborators pour créer les Collaborator
        // TODO: 6. Supprimer la vidéo du serveur (fs.unlink)
        
        res.status(201).json({ message: "Bravo !" });
    } catch (error) {
        // TODO: Gérer le nettoyage des fichiers en cas d'erreur
        res.status(500).json({ error: error.message });
    }
};