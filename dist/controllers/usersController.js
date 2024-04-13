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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySigninCode = exports.signInUser = exports.finalSignUp = exports.verifySignupCode = exports.initialSignUp = void 0;
const uuid_1 = require("uuid");
const email_1 = require("../utils/email");
const token_1 = require("../utils/token");
const usersModel_1 = require("../models/usersModel");
const sequelize_1 = require("sequelize");
// Initial sign up
const initialSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, email } = req.body;
        // Check if the email or phoneNumber already exists in the database
        const existingUser = yield usersModel_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { email: req.body.email },
                    { phoneNumber: req.body.phoneNumber }
                ]
            }
        });
        if (existingUser) {
            let message = '';
            if (existingUser.email === req.body.email) {
                message = 'Email already exists';
            }
            else if (existingUser.phoneNumber === req.body.phoneNumber) {
                message = 'Phone number already exists';
            }
            return res.status(400).json({ message });
        }
        // Store phoneNumber and email in session 
        req.session.phoneNumber = phoneNumber;
        req.session.email = email;
        // Generate verification code
        const verificationCode = (0, token_1.generateVerificationCode)();
        req.session.verificationCode = verificationCode;
        // Send verification code to user's email
        yield (0, email_1.sendVerificationCode)(email, verificationCode);
        return res.status(200).json({
            message: 'Verification code sent to email',
            data: { verificationCode }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while sending code' });
    }
});
exports.initialSignUp = initialSignUp;
// Verify code
const verifySignupCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { verificationCode } = req.body;
        // Convert both to string before comparing
        if (String(verificationCode) === String(req.session.verificationCode)) {
            res.status(200).json({
                message: 'Verification successful',
                email: req.session.email,
                phoneNumber: req.session.phoneNumber,
            });
        }
        else {
            res.status(400).json({ message: 'Invalid verification code' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while verifying the code' });
    }
});
exports.verifySignupCode = verifySignupCode;
// Final sign up
function finalSignUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = (0, uuid_1.v4)();
            const { firstName, lastName } = req.body;
            // Generate a JWT token for the user
            const token = (0, token_1.signToken)(userId);
            // Create a new user in the database
            const newUser = yield usersModel_1.User.create({
                phoneNumber: req.session.phoneNumber,
                email: req.session.email,
                firstName,
                lastName,
                userId,
            });
            yield newUser.save();
            return res.status(201).json({
                message: "New User created",
                token,
                data: { newUser }
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    });
}
exports.finalSignUp = finalSignUp;
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, email } = req.body;
        // Check if the email and the phone number already exists in the database
        const user = yield usersModel_1.User.findOne({ where: { email, phoneNumber } });
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }
        // Store phoneNumber and email in session
        req.session.phoneNumber = phoneNumber;
        req.session.email = email;
        // Generate verification code
        const verificationCode = (0, token_1.generateVerificationCode)();
        req.session.verificationCode = verificationCode;
        // Send verification code to user's email
        yield (0, email_1.sendVerificationCode)(email, verificationCode);
        return res.status(200).json({
            message: 'Verification code sent to email',
            data: { verificationCode }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while sending code' });
    }
});
exports.signInUser = signInUser;
function verifySigninCode(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { verificationCode } = req.body;
            // Check if the verification code matches the one in the session
            if (String(req.session.verificationCode) !== String(verificationCode)) {
                return res.status(400).json({
                    message: "Invalid verification code"
                });
            }
            // Check if user exists
            const user = yield usersModel_1.User.findOne({ where: { email: req.session.email, phoneNumber: req.session.phoneNumber } });
            if (!user) {
                return res.status(404).json({
                    message: 'Sign up instead?',
                    error: 'User not found',
                });
            }
            const token = (0, token_1.signToken)(user.userId);
            // Set the token in a cookie
            res.cookie('token', token, { httpOnly: true });
            return res.status(200).json({
                status: 'success',
                message: 'User signed in successfully',
                data: { user }
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while verifying the code' });
        }
    });
}
exports.verifySigninCode = verifySigninCode;
;
