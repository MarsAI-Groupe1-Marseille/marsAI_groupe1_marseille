const multer = require('multer');
const path = require('path');
const fs = require('fs');

// S'assurer que le dossier d'upload existe, sinon on le crée
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 1. CONFIGURATION DU STOCKAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Tous les fichiers vont dans 'uploads/'
  },
  filename: (req, file, cb) => {
    // On nettoie le nom du fichier (enlève les espaces) et on ajoute un timestamp
    const name = file.originalname.split(' ').join('_').replace(/\.[^/.]+$/, "");
    const extension = path.extname(file.originalname);
    cb(null, name + '_' + Date.now() + extension);
  }
});

// 2. FILTRE DES FICHIERS (SÉCURITÉ) 🛡️
const fileFilter = (req, file, cb) => {
  // A. Vidéos
  if (file.fieldname === 'video_file') {
    if (file.mimetype === 'video/mp4' || file.mimetype === 'video/quicktime' || file.mimetype === 'video/x-msvideo') {
      cb(null, true);
    } else {
      cb(new Error('Format vidéo invalide (MP4, MOV, AVI acceptés).'), false);
    }
  } 
  // B. Images (Affiche + Galerie)
  else if (file.fieldname === 'poster_file' || file.fieldname === 'gallery_files') {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(new Error('Format image invalide (JPG, PNG, WEBP acceptés).'), false);
    }
  }
  // C. Sous-titres
  else if (file.fieldname === 'subtitle_file') {
    // Les sous-titres sont souvent 'application/x-subrip', 'text/vtt' ou simplement 'text/plain'
    if (file.originalname.match(/\.(srt|vtt|txt)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Format sous-titre invalide (SRT, VTT acceptés).'), false);
    }
  } 
  else {
    cb(new Error('Champ de fichier inconnu.'), false);
  }
};

// 3. INITIALISATION
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500 // Limite globale à 500MB (à ajuster selon besoin)
  }
});

module.exports = upload;