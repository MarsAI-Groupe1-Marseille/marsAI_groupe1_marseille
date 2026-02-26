const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
const { Op } = require('sequelize');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback" 
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        const emailFromGoogle = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        let user = await User.findOne({ 
            where: { 
                [Op.or]: [
                    { google_id: profile.id },
                    { email: emailFromGoogle }
                ]
            } 
        });

        if (!user) {
            // On renvoie "false" pour dire : "Tu n'es pas sur la liste des invités"
            return done(null, false, { message: "Accès interdit. Vous n'êtes pas invité au jury." });
        }

        if (!user.google_id) {
            user.google_id = profile.id;
            await user.save();// On enregistre son ID Google pour la prochaine fois
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
  }
));

module.exports = passport;