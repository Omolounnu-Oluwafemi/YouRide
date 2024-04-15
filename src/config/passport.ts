import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy}  from "passport-facebook";
import AppleStrategy from "passport-apple";
import { User } from "../models/usersModel";
import { config } from "dotenv";
import { Sequelize } from "sequelize";

config();

interface DoneFunction {
  (error: any, user?: any): void;
}

export default function authSetup(sequelize: Sequelize) {
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: process.env.GOOGLE_REDIRECT_URL as string,
      },
    async (_accessToken, _refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ where: { googleId: profile.id } });

            if (!user) {
                // If user not found, create a new user
                user = await User.create({
                    googleId: profile.id,
                    phoneNumber: '',
                    email: profile.emails?.[0]?.value ?? '',
                    firstName: profile.name?.givenName ?? '',
                    lastName: profile.name?.familyName ?? '',
                    ssoProvider: 'Google',
                    appleId: '',
                    facebookId: '',
                });
            }

            return done(null, user);
        } catch (error) {
            console.error('Error authenticating with Google:', error);
            return done(error as Error);
        }
    }
    )
  );

       // Facebook Strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID as string,
        clientSecret: process.env.FACEBOOK_APP_SECRET as string,
        callbackURL: process.env.FACEBOOK_REDIRECT_URL as string,
        profileFields: ['id', 'emails', 'name'] // fields to retrieve
      },
    async (_accessToken, _refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ where: { facebookId: profile.id } });

            if (!user) {
                user = await User.create({
                    facebookId: profile.id,
                    email: profile.emails?.[0]?.value ?? '',
                    firstName: profile.name?.givenName ?? '',
                    lastName: profile.name?.familyName ?? '',
                    ssoProvider: 'Facebook',
                    googleId: '',
                    phoneNumber: '',
                    appleId: '',
                });
            }

            return done(null, user);
        } catch (error) {
            console.error('Error authenticating with Facebook:', error);
            return done(error as Error);
        }
    }
    )
  );

    // Apple Strategy
  passport.use(
    new AppleStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID as string,
        teamID: process.env.APPLE_TEAM_ID as string,
        callbackURL: process.env.APPLE_REDIRECT_URL as string,
        keyID: process.env.APPLE_KEY_ID as string,
        privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION as string,
      },
    async (_accessToken, _refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ where: { appleId: profile.id } });

            if (!user) {
                user = await User.create({
                    appleId: profile.id,
                    email: profile.emails?.[0]?.value ?? '',
                    firstName: profile.name?.firstName ?? '',
                    lastName: profile.name?.lastName ?? '',
                    ssoProvider: 'Apple',
                    facebookId: '',
                    phoneNumber: '',
                    googleId: '',
                });
            }

            return done(null, user);
        } catch (error) {
            console.error('Error authenticating with Apple:', error);
            return done(error as Error);
        }
    }
    )
  );
        // Serialize and deserialize user for session management
        passport.serializeUser((user, done) => {
          done(null, user.userId); 
        });

        passport.deserializeUser(async (userId, done) => {
        try {
          const user = await User.findByPk(userId);
          done(null, user);
        } catch (error) {
          done(error);
        }
        });
}
