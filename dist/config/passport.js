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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const passport_apple_1 = __importDefault(require("passport-apple"));
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
                    appleId: '',
                    facebookId: '',
                });
            }
            return done(null, user);
        }
        catch (error) {
            console.error('Error authenticating with Google:', error);
            return done(error);
        }
    })));
    // Facebook Strategy
    passport_1.default.use(new passport_facebook_1.Strategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_REDIRECT_URL,
        profileFields: ['id', 'emails', 'name'] // fields to retrieve
    }, (_accessToken, _refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
        var _h, _j, _k, _l, _m, _o, _p;
        try {
            let user = yield usersModel_1.User.findOne({ where: { facebookId: profile.id } });
            if (!user) {
                user = yield usersModel_1.User.create({
                    facebookId: profile.id,
                    email: (_k = (_j = (_h = profile.emails) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.value) !== null && _k !== void 0 ? _k : '',
                    firstName: (_m = (_l = profile.name) === null || _l === void 0 ? void 0 : _l.givenName) !== null && _m !== void 0 ? _m : '',
                    lastName: (_p = (_o = profile.name) === null || _o === void 0 ? void 0 : _o.familyName) !== null && _p !== void 0 ? _p : '',
                    ssoProvider: 'Facebook',
                    googleId: '',
                    phoneNumber: '',
                    appleId: '',
                });
            }
            return done(null, user);
        }
        catch (error) {
            console.error('Error authenticating with Facebook:', error);
            return done(error);
        }
    })));
    // Apple Strategy
    passport_1.default.use(new passport_apple_1.default({
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        callbackURL: process.env.APPLE_REDIRECT_URL,
        keyID: process.env.APPLE_KEY_ID,
        privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION,
    }, (_accessToken, _refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
        var _q, _r, _s, _t, _u, _v, _w;
        try {
            let user = yield usersModel_1.User.findOne({ where: { appleId: profile.id } });
            if (!user) {
                user = yield usersModel_1.User.create({
                    appleId: profile.id,
                    email: (_s = (_r = (_q = profile.emails) === null || _q === void 0 ? void 0 : _q[0]) === null || _r === void 0 ? void 0 : _r.value) !== null && _s !== void 0 ? _s : '',
                    firstName: (_u = (_t = profile.name) === null || _t === void 0 ? void 0 : _t.firstName) !== null && _u !== void 0 ? _u : '',
                    lastName: (_w = (_v = profile.name) === null || _v === void 0 ? void 0 : _v.lastName) !== null && _w !== void 0 ? _w : '',
                    ssoProvider: 'Apple',
                    facebookId: '',
                    phoneNumber: '',
                    googleId: '',
                });
            }
            return done(null, user);
        }
        catch (error) {
            console.error('Error authenticating with Apple:', error);
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
