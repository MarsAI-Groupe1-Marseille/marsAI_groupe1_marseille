// -----------------------------------------------------------------------------
// SERVICE D'EMAILING (Ticket #73)
// Gère l'envoi des mails transactionnels via Nodemailer.
// Basé sur le Plan Backend (Services/Emailing)
// -----------------------------------------------------------------------------

const transporter = require('../config/mail');

const emailService = { // ✅ Nom mis à jour pour correspondre au fichier

    /**
     * 1. EMAIL DE BIENVENUE
     * Déclenché après l'inscription d'un utilisateur.
     */
    sendWelcomeEmail: async (user) => {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Bienvenue sur Mars'AI ! 🎬",
                html: `
                    <div style="font-family: Arial; color: #333; max-width: 600px;">
                        <h1 style="color: #D32F2F;">Bonjour ${user.username || 'cinéaste'} !</h1>
                        <p>Bienvenue dans l'aventure <strong>Mars'AI</strong>.</p>
                        <p>Ton compte est validé. Tu peux dès maintenant te connecter.</p>
                        <br>
                        <p>L'équipe Mars'AI 🤖</p>
                    </div>
                `
            });
            console.log(`✅ Mail bienvenue envoyé à : ${user.email}`);
        } catch (error) {
            console.error("❌ Erreur mail bienvenue :", error);
        }
    },

    /**
     * 2. CONFIRMATION DE DÉPÔT
     * Déclenché quand un réalisateur soumet un film.
     */
    sendSubmissionConfirmation: async (user, filmTitle) => {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: `Dépôt confirmé : ${filmTitle} 🎥`,
                html: `
                    <div style="font-family: Arial; color: #333;">
                        <h1>Bravo !</h1>
                        <p>Ton court-métrage <strong>"${filmTitle}"</strong> a bien été reçu.</p>
                        <p>Notre jury va bientôt le visionner. Tu recevras une notification s'il est sélectionné.</p>
                        <p>Bonne chance ! 🍀</p>
                    </div>
                `
            });
            console.log(`✅ Mail dépôt envoyé à : ${user.email}`);
        } catch (error) {
            console.error("❌ Erreur mail dépôt :", error);
        }
    },

    /**
     * 3. INVITATION JURY
     * Déclenché par l'admin pour inviter un membre du jury.
     * Utilisé dans le userController (Ticket #74).
     */
    sendJuryInvitation: async (email, password, link) => {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Tu es invité(e) au Jury Mars'AI ! ⚖️",
                html: `
                    <div style="font-family: Arial; color: #333;">
                        <h1 style="color: #1976D2;">Félicitations !</h1>
                        <p>Tu as été sélectionné(e) pour être membre du Jury.</p>
                        <p>Voici tes accès pour noter les films :</p>
                        <ul>
                            <li><strong>Lien :</strong> <a href="${link}">${link}</a></li>
                            <li><strong>Mot de passe temporaire :</strong> ${password}</li>
                        </ul>
                        <p>Merci de ta participation !</p>
                    </div>
                `
            });
            console.log(`✅ Mail invitation jury envoyé à : ${email}`);
        } catch (error) {
            console.error("❌ Erreur mail jury :", error);
        }
    }
};

module.exports = emailService; // ✅ Export mis à jour