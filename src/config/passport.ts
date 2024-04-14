// authSetup.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
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
