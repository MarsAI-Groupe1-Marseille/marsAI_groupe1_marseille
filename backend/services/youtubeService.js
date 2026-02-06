const { google } = require('googleapis');
const fs = require('fs');
require('dotenv').config(); // Important pour lire le .env

// On charge les clés depuis le .env (Sécurité 🔒)
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

exports.uploadVideoToYoutube = async (filePath, title, description) => {
  try {
    // On initialise YouTube à l'intérieur pour la fraîcheur du token
    const youtube = google.youtube({
        version: 'v3', 
        auth: oauth2Client 
    });

    if (!fs.existsSync(filePath)) throw new Error("Fichier introuvable");

    console.log(`📤 Upload vers YouTube : ${title}`);

    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: title,
          description: description,
          categoryId: '22',
        },
        status: {
          privacyStatus: 'unlisted',
        },
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });

    return response.data.id;

  } catch (error) {
    console.error("Erreur Upload YouTube:", error.message);
    throw error;
  }
};