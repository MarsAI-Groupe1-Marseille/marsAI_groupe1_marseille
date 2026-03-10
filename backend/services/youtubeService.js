const { google } = require('googleapis');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();
const logger = require('../config/logger');

// 1. CONFIGURATION SCALEWAY S3
const s3Client = new S3Client({
    endpoint: process.env.SCALEWAY_ENDPOINT,
    region: process.env.SCALEWAY_REGION,
    credentials: {
        accessKeyId: process.env.SCALEWAY_ACCESS_KEY,
        secretAccessKey: process.env.SCALEWAY_SECRET_KEY,
    }
});

// 2. CONFIGURATION YOUTUBE OAUTH2
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

/**
 * Upload une vidéo vers YouTube en la streamant directement depuis Scaleway S3
 * @param {string} s3Key - La clé du fichier sur le bucket (ex: grp1/videos/monfilm.mp4)
 * @param {string} title - Titre de la vidéo
 * @param {string} description - Description de la vidéo
 */
exports.uploadVideoToYoutube = async (s3Key, title, description) => {
    try {
        const youtube = google.youtube({
            version: 'v3',
            auth: oauth2Client
        });

        logger.info('Initialisation du stream depuis Scaleway', { s3Key });

        // A. RÉCUPÉRER LE FLUX DEPUIS SCALEWAY
        const getObjectParams = {
            Bucket: process.env.SCALEWAY_BUCKET_NAME,
            Key: s3Key,
        };

        const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));
        
        // Body est un ReadableStream venant de Scaleway S3
        if (!Body) throw new Error("Impossible de récupérer le flux depuis S3");

        logger.info('Upload en cours vers YouTube', { title, s3Key });

        // B. ENVOI DU FLUX À YOUTUBE
        const response = await youtube.videos.insert({
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: title,
                    description: description,
                    categoryId: '1', // '1' pour Film & Animation (plus pro que '22')
                },
                status: {
                    privacyStatus: 'unlisted', // On garde unlisted pour la modération
                },
            },
            media: {
                body: Body, // On passe directement le flux S3 ici !
            },
        }, {
            // Configuration pour gérer les gros fichiers
            onUploadProgress: (evt) => {
                const progress = (evt.bytesRead / 1024 / 1024).toFixed(2);
                logger.debug('Progression upload YouTube', { progressMb: Number(progress), title });
            }
        });

        logger.info('Upload YouTube termine', { youtubeId: response.data.id, title });
        return response.data.id;

    } catch (error) {
        logger.error('Erreur upload YouTube via S3 stream', {
            s3Key,
            title,
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
};

/**
 * Upload des sous-titres pour une vidéo déjà existante sur YouTube
 */
exports.uploadSubtitlesToYoutube = async (youtubeId, s3Key, language = 'fr') => {
    try {
        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

        const getObjectParams = {
            Bucket: process.env.SCALEWAY_BUCKET_NAME,
            Key: s3Key,
        };

        const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));

        // On force un code ISO propre (ex: si on reçoit 'Francais', on met 'fr')
        // YouTube est très strict : 'fr', 'en', 'es', etc.
        const isoLanguage = language.toLowerCase().substring(0, 2); 

        logger.info('Envoi des sous-titres YouTube', { youtubeId, language: isoLanguage, s3Key });

        await youtube.captions.insert({
            part: 'snippet',
            requestBody: {
                snippet: {
                    videoId: youtubeId,
                    language: isoLanguage, // Utilise 'fr' au lieu de 'Francais'
                    name: 'Original',      // Un nom simple sans caractères spéciaux
                    isDefault: true
                }
            },
            media: {
                mimeType: 'text/vtt', // Ou 'application/octet-stream' si c'est du .srt
                body: Body
            }
        });

        logger.info('Sous-titres ajoutes avec succes sur YouTube', { youtubeId, language: isoLanguage });
    } catch (error) {
        logger.error('Erreur lors de l\'ajout des sous-titres YouTube', {
            youtubeId,
            s3Key,
            error: error.response?.data?.error || error.message
        });
    }
};