// -----------------------------------------------------------------------------
// SERVICE D'EMAILING (Ticket #73)
// Gère l'envoi des mails transactionnels via Nodemailer.
// Basé sur le Plan Backend (Services/Emailing)
// -----------------------------------------------------------------------------

const transporter = require('../config/mail');

const emailService = {

    /**
     * 1. EMAIL DE BIENVENUE
     * Déclenché après l'inscription d'un utilisateur.
     */
    sendWelcomeEmail: async (user) => {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "Bienvenue sur Mars'AI ! ",
                html: `
                    <div style="font-family: Arial; color: #333; max-width: 600px;">
                        <h1 style="color: #D32F2F;">Bonjour ${user.username || 'cinéaste'} !</h1>
                        <p>Bienvenue dans l'aventure <strong>Mars'AI</strong>.</p>
                        <p>Ton compte est validé. Tu peux dès maintenant te connecter.</p>
                        <br>
                        <p>L'équipe Mars'AI </p>
                    </div>
                `
            });
            console.log(`Mail bienvenue envoyé à : ${user.email}`);
        } catch (error) {
            console.error(" Erreur mail bienvenue :", error);
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
                        <p>Bonne chance ! </p>
                    </div>
                `
            });
            console.log(`Mail dépôt envoyé à : ${user.email}`);
        } catch (error) {
            console.error("Erreur mail dépôt :", error);
        }
    },

    /**
     * 3. INVITATION JURY (ancienne version - gardée pour compatibilité)
     * Déclenché par l'admin pour inviter un membre du jury.
     * Utilisé dans le userController (Ticket #74).
     */
    sendJuryInvitation: async (email, password, link) => {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Tu es invité(e) au Jury Mars'AI ! ",
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
            console.log(`Mail invitation jury envoyé à : ${email}`);
        } catch (error) {
            console.error(" Erreur mail jury :", error);
        }
    },

    /**
     * 3bis. INVITATION UTILISATEUR GÉNÉRIQUE
     * Déclenché par l'admin pour inviter un utilisateur (jury, admin, modérateur).
     * L'email est adapté selon le rôle.
     */
    sendUserInvitation: async (email, fullName, role, link) => {
        try {
            // Configuration selon le rôle
            const roleConfig = {
                jury: {
                    subject: "Tu es invité(e) au Jury Mars'AI !",
                    title: "Félicitations !",
                    color: "#1976D2",
                    message: "Tu as été sélectionné(e) pour être membre du Jury.",
                    description: "Tu pourras visionner et noter les films soumis au concours."
                },
                admin: {
                    subject: "Invitation - Administrateur Mars'AI",
                    title: "Bienvenue dans l'équipe !",
                    color: "#D32F2F",
                    message: "Tu as été invité(e) en tant qu'administrateur de la plateforme Mars'AI.",
                    description: "Tu auras accès à la gestion complète de la plateforme et des utilisateurs."
                },
                moderator: {
                    subject: "Invitation - Modérateur Mars'AI",
                    title: "Rejoins l'équipe de modération !",
                    color: "#7B1FA2",
                    message: "Tu as été sélectionné(e) pour être modérateur.",
                    description: "Tu pourras valider ou refuser les films soumis au concours."
                }
            };

            const config = roleConfig[role] || roleConfig.jury;

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: config.subject,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: ${config.color};">${config.title}</h1>
                        <p>Bonjour <strong>${fullName}</strong>,</p>
                        <p>${config.message}</p>
                        <p>${config.description}</p>
                        <div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
                            <p style="margin: 0 0 10px 0;"><strong>Pour activer ton compte :</strong></p>
                            <ol style="margin: 10px 0; padding-left: 20px;">
                                <li>Clique sur le lien ci-dessous</li>
                                <li>Définis ton mot de passe</li>
                                <li>Connecte-toi à la plateforme</li>
                            </ol>
                            <p style="margin: 20px 0;">
                                <a href="${link}" 
                                   style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, ${config.color}, ${config.color}dd); color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                    Activer mon compte
                                </a>
                            </p>
                            <p style="margin: 10px 0; font-size: 12px; color: #666;">
                                Ou copie ce lien dans ton navigateur :<br>
                                <span style="color: #1976D2;">${link}</span>
                            </p>
                        </div>
                        <p style="margin-top: 30px;">À très bientôt sur Mars'AI !</p>
                        <p style="color: #666; font-size: 12px; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px;">
                            Si tu n'as pas demandé cette invitation, tu peux ignorer cet email.
                        </p>
                    </div>
                `
            });
            console.log(`Mail invitation ${role} envoyé à : ${email}`);
        } catch (error) {
            console.error(`Erreur mail invitation ${role} :`, error);
            throw error;
        }
    },
   

    /**
     * 4. FILM APPROUVÉ / SÉLECTIONNÉ
     * Déclenché par l'admin quand un film passe la modération.
     */
    sendFilmApproved: async (user, filmTitle) => {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: `Félicitations ! Votre film "${filmTitle}" est sélectionné ! 🎬`,
                html: `
                    <div style="font-family: Arial; color: #333;">
                        <h1 style="color: #2E7D32;">Excellente nouvelle !</h1>
                        <p>Bonjour ${user.username},</p>
                        <p>Nous avons le plaisir de t'annoncer que ton film <strong>"${filmTitle}"</strong> a été validé par notre équipe de modération.</p>
                        <p>Il est désormais visible par le Jury et le public.</p>
                        <br>
                        <p>L'équipe Mars'AI</p>
                    </div>
                `
            });
            console.log(`Mail approbation envoyé à : ${user.email}`);
        } catch (error) {
            console.error("Erreur mail approbation :", error);
        }
    },

    /**
     * 5. FILM REFUSÉ
     * Déclenché par l'admin si le film ne respecte pas les règles.
     */
    sendFilmRefused: async (user, filmTitle, reason) => {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: `Mise à jour concernant votre film "${filmTitle}"`,
                html: `
                    <div style="font-family: Arial; color: #333;">
                        <h1 style="color: #C62828;">Notification de modération</h1>
                        <p>Bonjour ${user.username},</p>
                        <p>Malheureusement, ton film <strong>"${filmTitle}"</strong> n'a pas été retenu pour la compétition.</p>
                        <p><strong>Raison :</strong> ${reason || "Non-respect des critères de la charte."}</p>
                        <p>Tu peux modifier ton film et le soumettre à nouveau.</p>
                        <br>
                        <p>L'équipe Mars'AI</p>
                    </div>
                `
            });
            console.log(`Mail refus envoyé à : ${user.email}`);
        } catch (error) {
            console.error("Erreur mail refus :", error);
        }
    },

    /**
     * 6. RÉINITIALISATION DE MOT DE PASSE
     * Déclenché quand un utilisateur demande réinitialiser son mot de passe
     */
    sendResetPasswordEmail: async (email, fullName, resetLink) => {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Réinitialiser votre mot de passe - Mars'AI",
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #1976D2;">Réinitialisation de mot de passe</h1>
                        <p>Bonjour <strong>${fullName}</strong>,</p>
                        <p>Vous avez demandé la réinitialisation de votre mot de passe Mars'AI.</p>
                        <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
                        
                        <div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
                            <p style="margin: 20px 0;">
                                <a href="${resetLink}" 
                                   style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #1976D2, #1565C0); color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                    Réinitialiser mon mot de passe
                                </a>
                            </p>
                            <p style="margin: 10px 0; font-size: 12px; color: #666;">
                                Ou copie ce lien dans ton navigateur :<br>
                                <span style="color: #1976D2; word-break: break-all;">${resetLink}</span>
                            </p>
                        </div>
                        
                        <p style="color: #C62828; font-weight: bold;">⚠️ Important :</p>
                        <ul style="color: #666; font-size: 14px;">
                            <li>Ce lien expire dans 24 heures</li>
                            <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
                            <li>Ne partagez jamais ce lien avec d'autres personnes</li>
                        </ul>
                        
                        <p style="margin-top: 30px; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px;">
                            L'équipe Mars'AI
                        </p>
                    </div>
                `
            });
            console.log(`Mail réinitialisation mot de passe envoyé à : ${email}`);
        } catch (error) {
            console.error("Erreur mail réinitialisation mot de passe :", error);
            throw error;
        }
    }


};

module.exports = emailService; 