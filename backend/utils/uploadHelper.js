const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
require('dotenv').config();

// Configuration du client S3 Scaleway
const s3Client = new S3Client({
    endpoint: process.env.SCALEWAY_ENDPOINT,
    region: process.env.SCALEWAY_REGION,
    credentials: {
        accessKeyId: process.env.SCALEWAY_ACCESS_KEY,
        secretAccessKey: process.env.SCALEWAY_SECRET_KEY,
    }
});

const buildScalewayPublicUrl = (fileName) => {
    const endpoint = process.env.SCALEWAY_ENDPOINT || '';
    const bucket = process.env.SCALEWAY_BUCKET_NAME;

    if (!bucket) {
        throw new Error('SCALEWAY_BUCKET_NAME manquant');
    }

    // Ex: https://s3.fr-par.scw.cloud -> https://<bucket>.s3.fr-par.scw.cloud/<key>
    try {
        const endpointUrl = new URL(endpoint);
        const host = endpointUrl.host || '';
        const protocol = endpointUrl.protocol || 'https:';

        if (host.startsWith('s3.')) {
            return `${protocol}//${bucket}.${host}/${fileName}`;
        }

        // Fallback: host custom, on garde une URL valide de type path-style.
        return `${protocol}//${host}/${bucket}/${fileName}`;
    } catch (_error) {
        // Fallback final basé sur region
        return `https://${bucket}.s3.${process.env.SCALEWAY_REGION}.scw.cloud/${fileName}`;
    }
};

const normalizeLegacyScalewayUrl = (value) => {
    if (typeof value !== 'string') return value;

    // Corrige l'ancien format: <bucket>.<region>.scw.cloud -> <bucket>.s3.<region>.scw.cloud
    return value.replace(
        /^https:\/\/([^.]+)\.([a-z0-9-]+)\.scw\.cloud\/(.+)$/i,
        'https://$1.s3.$2.scw.cloud/$3'
    );
};

const normalizeConfigImageUrls = (config) => {
    if (!config || typeof config !== 'object') return config;

    const processed = JSON.parse(JSON.stringify(config));

    if (processed.categories?.items && Array.isArray(processed.categories.items)) {
        for (const item of processed.categories.items) {
            if (item?.image) item.image = normalizeLegacyScalewayUrl(item.image);
        }
    }

    if (processed.awards?.items && Array.isArray(processed.awards.items)) {
        for (const item of processed.awards.items) {
            if (item?.image) item.image = normalizeLegacyScalewayUrl(item.image);
        }
    }

    if (processed.partners?.items && Array.isArray(processed.partners.items)) {
        for (const item of processed.partners.items) {
            if (item?.image) item.image = normalizeLegacyScalewayUrl(item.image);
        }
    }

    return processed;
};

const ALLOWED_BASE64_MIME_TYPES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
]);

const isJpegBuffer = (buffer) => buffer.length >= 3
    && buffer[0] === 0xff
    && buffer[1] === 0xd8
    && buffer[2] === 0xff;

const isPngBuffer = (buffer) => buffer.length >= 8
    && buffer[0] === 0x89
    && buffer[1] === 0x50
    && buffer[2] === 0x4e
    && buffer[3] === 0x47
    && buffer[4] === 0x0d
    && buffer[5] === 0x0a
    && buffer[6] === 0x1a
    && buffer[7] === 0x0a;

const isWebpBuffer = (buffer) => buffer.length >= 12
    && buffer.subarray(0, 4).toString('ascii') === 'RIFF'
    && buffer.subarray(8, 12).toString('ascii') === 'WEBP';

const getExtensionFromMime = (mimeType) => {
    switch (mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
            return 'jpg';
        case 'image/png':
            return 'png';
        case 'image/webp':
            return 'webp';
        default:
            return null;
    }
};

const validateImageSignature = (mimeType, buffer) => {
    switch (mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
            return isJpegBuffer(buffer);
        case 'image/png':
            return isPngBuffer(buffer);
        case 'image/webp':
            return isWebpBuffer(buffer);
        default:
            return false;
    }
};

/**
 * Upload une image base64 vers S3 et retourne l'URL publique
 * @param {string} base64Data - L'image en base64 (data:image/png;base64,...)
 * @param {string} folder - Le sous-dossier dans le bucket (ex: config/categories)
 * @returns {Promise<string>} L'URL publique de l'image sur S3
 */
async function uploadBase64ToS3(base64Data, folder = 'config') {
    try {
        // 1. Extraire le type MIME et les données base64
        const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error('Format base64 invalide');
        }

        const mimeType = matches[1].toLowerCase(); // ex: image/png
        const base64Content = matches[2];
        const buffer = Buffer.from(base64Content, 'base64');

        // Validation forte: MIME autorise + signature binaire reelle
        if (!ALLOWED_BASE64_MIME_TYPES.has(mimeType)) {
            throw new Error(`Type MIME non autorise: ${mimeType}`);
        }

        if (!validateImageSignature(mimeType, buffer)) {
            throw new Error(`Le contenu du fichier ne correspond pas au MIME declare (${mimeType})`);
        }

        // 2. Déterminer l'extension
        const extension = getExtensionFromMime(mimeType);
        if (!extension) {
            throw new Error(`Extension non supportee pour MIME: ${mimeType}`);
        }
        
        // 3. Générer un nom de fichier unique
        const randomHash = crypto.randomBytes(8).toString('hex');
        const timestamp = Date.now();
        const fileName = `${folder}/${randomHash}_${timestamp}.${extension}`;

        // 4. Préparer la commande d'upload S3
        const uploadParams = {
            Bucket: process.env.SCALEWAY_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: mimeType,
            ACL: 'public-read' // Rendre l'image accessible publiquement
        };

        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        // 5. Construire et retourner l'URL publique
        const publicUrl = buildScalewayPublicUrl(fileName);
        
        return publicUrl;

    } catch (error) {
        console.error('Erreur uploadBase64ToS3:', error);
        throw new Error(`Échec de l'upload S3: ${error.message}`);
    }
}

/**
 * Traite récursivement un objet de config et upload tous les base64 vers S3
 * @param {Object} config - L'objet de configuration à traiter
 * @returns {Promise<Object>} L'objet avec les URLs S3 au lieu des base64
 */
async function processConfigImages(config) {
    // Deep clone pour ne pas modifier l'original
    const processed = JSON.parse(JSON.stringify(config));

    // Traiter les catégories
    if (processed.categories?.items && Array.isArray(processed.categories.items)) {
        for (let item of processed.categories.items) {
            if (item.image && item.image.startsWith('data:image')) {
                console.log('Upload image catégorie:', item.title || item.key);
                item.image = await uploadBase64ToS3(item.image, 'config/categories');
            }
        }
    }

    // Traiter les awards
    if (processed.awards?.items && Array.isArray(processed.awards.items)) {
        for (let item of processed.awards.items) {
            if (item.image && item.image.startsWith('data:image')) {
                console.log('Upload image award:', item.label || item.label_en);
                item.image = await uploadBase64ToS3(item.image, 'config/awards');
            }
        }
    }

    // Traiter les partenaires
    if (processed.partners?.items && Array.isArray(processed.partners.items)) {
        for (let item of processed.partners.items) {
            if (item.image && item.image.startsWith('data:image')) {
                console.log('Upload logo partenaire:', item.name || item.name_en);
                item.image = await uploadBase64ToS3(item.image, 'config/partners');
            }
        }
    }

    return normalizeConfigImageUrls(processed);
}

module.exports = {
    uploadBase64ToS3,
    processConfigImages,
    normalizeConfigImageUrls
};
