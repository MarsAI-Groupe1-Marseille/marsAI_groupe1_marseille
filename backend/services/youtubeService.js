const { google } = require('googleapis');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

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

        console.log(`Initialisation du stream depuis Scaleway : ${s3Key}`);

        // A. RÉCUPÉRER LE FLUX DEPUIS SCALEWAY
        const getObjectParams = {
            Bucket: process.env.SCALEWAY_BUCKET_NAME,
            Key: s3Key,
        };

        const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));
        
        // Body est un ReadableStream venant de Scaleway S3
        if (!Body) throw new Error("Impossible de récupérer le flux depuis S3");

        console.log(`Upload en cours vers YouTube : ${title}...`);

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
                console.log(`${progress} MB uploadés...`);
            }
        });

        console.log("Upload YouTube terminé ! ID:", response.data.id);
        return response.data.id;

    } catch (error) {
        console.error("Erreur Upload YouTube via S3 Stream:", error.message);
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

        console.log(`Envoi des sous-titres (${isoLanguage}) pour la vidéo : ${youtubeId}`);

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

        console.log("Sous-titres ajoutés avec succès sur YouTube !");
    } catch (error) {
        console.error("Erreur lors de l'ajout des sous-titres :", 
            error.response?.data?.error || error.message);
    }
};