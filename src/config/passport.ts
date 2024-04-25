import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy}  from "passport-facebook";
import AppleStrategy from "passport-apple";
import { User } from "../models/usersModel";
import { config } from "dotenv";
import { Op, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

config();

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
         const userId = uuidv4();
        
            let user = await User.findOne({ 
                where: { 
                    [Op.or]: [
                        { userId: userId }, 
                        { email: profile.emails?.[0]?.value }
                    ] 
                } 
            });

            if (!user) {
                // If user not found, create a new user
              user = await User.create({
                    userId,
                    googleId: profile.id,
                    phoneNumber: '',
                    email: profile.emails?.[0]?.value ?? '',
                    firstName: profile.name?.givenName ?? '',
                    lastName: profile.name?.familyName ?? '',
                    ssoProvider: 'Google',
                    facebookId: '',
                    appleId: ''
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
            let user = await User.findOne({ where: { userId: profile.id } });

            if (!user) {
                user = await User.create({
                    facebookId: profile.id,
                    email: profile.emails?.[0]?.value ?? '',
                    firstName: profile.name?.givenName ?? '',
                    lastName: profile.name?.familyName ?? '',
                    ssoProvider: 'Facebook',
                    phoneNumber: '',
                    googleId: '',
                    appleId: ''
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
        passReqToCallback: true,
      },
    async (req, _accessToken, _refreshToken, _idToken, profile, done: (error: any, user?: any) => void) => {
        try {
            let user = await User.findOne({ where: { userId: (profile as any).id } });

            if (!user) {
              user = await User.create({
                appleId: (profile as any).id,
                email: (profile as any).emails?.[0]?.value ?? '',
                firstName: (profile as any).name?.givenName ?? '',
                lastName: (profile as any).lastName ?? '',
                ssoProvider: 'Apple',
                phoneNumber: '',
                facebookId: '',
                googleId: ''
              });
            }

            return done(null, user as any);
        } catch (error) {
            console.error('Error authenticating with Apple:', error);
            return done(error as Error);
        }
    }
    )
  );
        // Serialize and deserialize user for session management
        passport.serializeUser((user: any, done) => {
          done(null, user.userId as string); 
        });

        passport.deserializeUser(async (userId: number | string, done) => {
        try {
          const user = await User.findByPk(userId);
          done(null, user);
        } catch (error) {
          done(error);
        }
        });
}
