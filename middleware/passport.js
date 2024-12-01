import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${process.env.PORT}/google/callback`,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          "account.google.id": profile.id,
        });
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile._json.email,
            avatar: profile._json.picture,
            account: {
              google: {
                id: profile.id,
                token: accessToken,
                refreshToken: refreshToken,
                email: profile._json.email,
                name: profile.displayName,
              },
            },
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `http://localhost:${process.env.PORT}/facebook/callback`,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          "account.facebook.id": profile.id,
        });
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile._json.email,
            avatar: profile.photos[0].value,
            account: {
              facebook: {
                id: profile.id,
                token: accessToken,
                refreshToken: refreshToken,
                email: profile._json.email,
                name: profile.displayName,
              },
            },
          });

          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
