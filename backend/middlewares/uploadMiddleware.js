const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');




// 1. CONFIGURATION DU CLIENT SCALEWAY S3
const s3 = new S3Client({
    endpoint: process.env.SCALEWAY_ENDPOINT,
    region: process.env.SCALEWAY_REGION,
    credentials: {
        accessKeyId: process.env.SCALEWAY_ACCESS_KEY,
        secretAccessKey: process.env.SCALEWAY_SECRET_KEY,
    }
});

// 2. CONFIGURATION DU STOCKAGE S3
const storage = multerS3({
    s3: s3,
    bucket: process.env.SCALEWAY_BUCKET_NAME,
    acl: 'public-read', // Permet de lire les images via URL sans signature (OK pour posters/galerie)
    contentType: multerS3.AUTO_CONTENT_TYPE, // Détecte automatiquement le type MIME (image/jpeg, etc.)
    key: (req, file, cb) => {
        // Organisation par dossier dans le bucket
        let folder = process.env.SCALEWAY_FOLDER || 'uploads';
        
        if (file.fieldname === 'video_file') folder += '/videos';
        else if (file.fieldname === 'poster_file') folder += '/posters';
        else if (file.fieldname === 'gallery_files') folder += '/gallery';
        else if (file.fieldname === 'subtitle_file') folder += '/subtitles';
        else if (file.fieldname === 'avatar') folder += '/avatars';

        // Nettoyage du nom de fichier
        const name = file.originalname.split(' ').join('_').replace(/\.[^/.]+$/, "");
        const extension = path.extname(file.originalname);
        const fileName = `${folder}/${name}_${Date.now()}${extension}`;
        
        cb(null, fileName);
    }
});

// 3. FILTRE DES FICHIERS (On garde ta logique actuelle )
const fileFilter = (req, file, cb) => {
    // Liste précise des types MIME autorisés par le client
    const allowedVideoTypes = [
        'video/mp4', 
        'video/quicktime',     // Pour le .MOV
        'video/x-msvideo',     // Pour le .AVI
        'video/x-matroska'     // Optionnel: .MKV (souvent utilisé en IA)
    ];
    
    const allowedImageTypes = [
        'image/jpeg', 
        'image/jpg', 
        'image/png', 
        'image/webp'
    ];

    // A. Validation Vidéos
    if (file.fieldname === 'video_file') {
        if (allowedVideoTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Format vidéo invalide (MP4, MOV, AVI acceptés).'), false);
        }
    } 
    // B. Validation Images (Poster, Galerie, Avatar)
    else if (file.fieldname === 'poster_file' || file.fieldname === 'gallery_files' || file.fieldname === 'avatar') {
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Format image invalide (JPG, PNG, WEBP acceptés).'), false);
        }
    }
    // C. Validation Sous-titres
    else if (file.fieldname === 'subtitle_file') {
        // Pour les sous-titres, l'extension est plus fiable que le mimetype
        if (file.originalname.match(/\.(srt|vtt|txt)$/)) {
            cb(null, true);
        } else {
            cb(new Error('Format sous-titre invalide (SRT, VTT, TXT acceptés).'), false);
        }
    } 
    else {
        cb(new Error('Champ de fichier non autorisé.'), false);
    }
};

// 4. INITIALISATION
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 500 // 500MB
    }
});

module.exports = upload;