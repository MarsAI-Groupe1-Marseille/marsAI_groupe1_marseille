const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

passport.use(new GoogleStrategy({
    // On utilise les variables du .env
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback" 
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        // Vérification existence User avec google_id
        let user = await User.findOne({ where: { google_id: profile.id } });

        // 2. Si l'utilisateur n'est pas dans la base, on refuse l'accès
        if (!user) {
            // On renvoie "false" pour dire : "Tu n'es pas sur la liste des invités"
            return done(null, false, { message: "Accès interdit. Vous n'êtes pas invité au jury." });
        }

        // 3. Si c'est sa première connexion Google, on lie son compte
        if (!user.google_id) {
            user.google_id = profile.id;
            await user.save(); // On enregistre son ID Google pour la prochaine fois
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
  }
));

module.exports = passport;