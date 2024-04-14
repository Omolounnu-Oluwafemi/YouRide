"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// authSetup.ts
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const usersModel_1 = require("../models/usersModel");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function authSetup(sequelize) {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URL,
    }, (_accessToken, _refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            let user = yield usersModel_1.User.findOne({ where: { googleId: profile.id } });
            if (!user) {
                // If user not found, create a new user
                user = yield usersModel_1.User.create({
                    googleId: profile.id,
                    phoneNumber: '',
                    email: (_c = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : '',
                    firstName: (_e = (_d = profile.name) === null || _d === void 0 ? void 0 : _d.givenName) !== null && _e !== void 0 ? _e : '',
                    lastName: (_g = (_f = profile.name) === null || _f === void 0 ? void 0 : _f.familyName) !== null && _g !== void 0 ? _g : '',
                    ssoProvider: 'Google',
                });
            }
            return done(null, user);
        }
        catch (error) {
            console.error('Error authenticating with Google:', error);
            return done(error);
        }
    })));
    // Serialize and deserialize user for session management
    passport_1.default.serializeUser((user, done) => {
        done(null, user.userId);
    });
    passport_1.default.deserializeUser((userId, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield usersModel_1.User.findByPk(userId);
            done(null, user);
        }
        catch (error) {
            done(error);
        }
    }));
}
exports.default = authSetup;
