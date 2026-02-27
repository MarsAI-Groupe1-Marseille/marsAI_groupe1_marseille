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

        const mimeType = matches[1]; // ex: image/png
        const base64Content = matches[2];
        const buffer = Buffer.from(base64Content, 'base64');

        // 2. Déterminer l'extension
        const extension = mimeType.split('/')[1]; // png, jpeg, etc.
        
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
        const publicUrl = `https://${process.env.SCALEWAY_BUCKET_NAME}.${process.env.SCALEWAY_REGION}.scw.cloud/${fileName}`;
        
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

    return processed;
}

module.exports = {
    uploadBase64ToS3,
    processConfigImages
};
