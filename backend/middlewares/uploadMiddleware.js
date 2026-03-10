const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const fs = require('fs');
const os = require('os');
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

// Les fichiers arrivent d'abord en local pour permettre la validation de signature avant S3.
const TEMP_UPLOAD_DIR = process.env.TEMP_UPLOAD_DIR || path.join(os.tmpdir(), 'marsai-uploads');

if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
    fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
}

const sanitizeBaseName = (filename = '') => filename
    .split(' ')
    .join('_')
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '');

const getFolderForField = (fieldName) => {
    let folder = process.env.SCALEWAY_FOLDER || 'uploads';

    if (fieldName === 'video_file') folder += '/videos';
    else if (fieldName === 'poster_file') folder += '/posters';
    else if (fieldName === 'gallery_files') folder += '/gallery';
    else if (fieldName === 'subtitle_file') folder += '/subtitles';
    else if (fieldName === 'avatar') folder += '/avatars';

    return folder;
};

const buildS3Key = (fieldName, originalname) => {
    const folder = getFolderForField(fieldName);
    const extension = path.extname(originalname || '').toLowerCase();
    const safeName = sanitizeBaseName(originalname) || 'file';
    return `${folder}/${safeName}_${Date.now()}${extension}`;
};

const getContentTypeFromName = (filename = '') => {
    const extension = getFileTypeFromName(filename);
    const types = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        mp4: 'video/mp4',
        mov: 'video/quicktime',
        avi: 'video/x-msvideo',
        mkv: 'video/x-matroska',
        srt: 'application/x-subrip',
        vtt: 'text/vtt',
        txt: 'text/plain'
    };
    return types[extension] || 'application/octet-stream';
};

const buildPublicFileUrl = (key) => {
    const explicitBase = process.env.SCALEWAY_PUBLIC_BASE_URL;
    if (explicitBase) {
        return `${explicitBase.replace(/\/$/, '')}/${encodeURI(key).replace(/%2F/g, '/')}`;
    }

    // Fallback compatible Scaleway/endpoint custom si aucune base publique n'est definie.
    const endpoint = (process.env.SCALEWAY_ENDPOINT || '').replace(/\/$/, '');
    const bucket = process.env.SCALEWAY_BUCKET_NAME;
    return `${endpoint}/${bucket}/${encodeURI(key).replace(/%2F/g, '/')}`;
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, TEMP_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname || '').toLowerCase();
        const safeName = sanitizeBaseName(file.originalname) || 'file';
        cb(null, `${safeName}_${Date.now()}${extension}`);
    }
});

const getFileTypeFromName = (filename = '') => {
    const extension = path.extname(filename || '').toLowerCase();
    return extension.startsWith('.') ? extension.slice(1) : extension;
};

const buildFileError = (field, message) => {
    const error = new Error(message);
    error.field = field;
    error.code = 'INVALID_FILE_TYPE';
    return error;
};

// 3. FILTRE DES FICHIERS (validation par filetype/extension)
const fileFilter = (req, file, cb) => {
    // Le filetype est basé sur l'extension du nom de fichier.
    const allowedVideoTypes = [
        'mp4',
        'mov',
        'avi',
        'mkv'
    ];
    
    const allowedImageTypes = [
        'jpg',
        'jpeg',
        'png',
        'webp'
    ];

    const fileType = getFileTypeFromName(file.originalname);

    // A. Validation Vidéos
    if (file.fieldname === 'video_file') {
        if (allowedVideoTypes.includes(fileType)) {
            cb(null, true);
        } else {
            cb(buildFileError('video_file', 'Format video invalide (MP4, MOV, AVI, MKV acceptes).'), false);
        }
    } 
    // B. Validation Images (Poster, Galerie, Avatar)
    else if (file.fieldname === 'poster_file' || file.fieldname === 'gallery_files' || file.fieldname === 'avatar') {
        if (allowedImageTypes.includes(fileType)) {
            cb(null, true);
        } else {
            cb(buildFileError(file.fieldname, 'Format image invalide (JPG, JPEG, PNG, WEBP acceptes).'), false);
        }
    }
    // C. Validation Sous-titres
    else if (file.fieldname === 'subtitle_file') {
        if (['srt', 'vtt', 'txt'].includes(fileType)) {
            cb(null, true);
        } else {
            cb(buildFileError('subtitle_file', 'Format sous-titre invalide (SRT, VTT, TXT acceptes).'), false);
        }
    } 
    else {
        cb(buildFileError(file.fieldname, 'Champ de fichier non autorise.'), false);
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

const uploadSingleFileToS3 = async (file, fieldName = file.fieldname) => {
    const key = buildS3Key(fieldName, file.originalname);
    const bodyStream = fs.createReadStream(file.path);

    await s3.send(new PutObjectCommand({
        Bucket: process.env.SCALEWAY_BUCKET_NAME,
        Key: key,
        Body: bodyStream,
        ACL: 'public-read',
        ContentType: getContentTypeFromName(file.originalname)
    }));

    return {
        ...file,
        key,
        bucket: process.env.SCALEWAY_BUCKET_NAME,
        location: buildPublicFileUrl(key)
    };
};

module.exports = upload;
module.exports.uploadSingleFileToS3 = uploadSingleFileToS3;