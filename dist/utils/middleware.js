"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isSuperAdmin = exports.verifySignInLimiter = exports.generateTempPassword = exports.ValidateAdminPAsswordUpdate = exports.ValidateAdminSignIn = exports.ValidateAdminSignup = exports.ValidateDriverSignup = exports.validateVerificationCode = exports.validateInitialSignUp = exports.validateFinalSignUp = void 0;
const validate_1 = require("../utils/validate");
const validate_2 = require("../utils/validate");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const token_1 = require("./token");
function validateFinalSignUp(req, res, next) {
    const { error } = validate_1.finalSignUpValidator.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }
    next();
}
exports.validateFinalSignUp = validateFinalSignUp;
function validateInitialSignUp(req, res, next) {
    const { error } = validate_1.initiialSignUpValidator.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }
    next();
}
exports.validateInitialSignUp = validateInitialSignUp;
function validateVerificationCode(req, res, next) {
    const { error } = validate_1.verificationCodeValidator.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        });
    }
    next();
}
exports.validateVerificationCode = validateVerificationCode;
function ValidateDriverSignup(req, res, next) {
    const { error } = validate_2.DriverSignupValidator.validate(req.body, validate_1.options);
    if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({
            errors
        });
    }
    next();
}
exports.ValidateDriverSignup = ValidateDriverSignup;
function ValidateAdminSignup(req, res, next) {
    const { error } = validate_1.AdminSignupValidator.validate(req.body, validate_1.options);
    if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({
            errors
        });
    }
    next();
}
exports.ValidateAdminSignup = ValidateAdminSignup;
function ValidateAdminSignIn(req, res, next) {
    const { error } = validate_1.AdminSignInValidator.validate(req.body, validate_1.options);
    if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({
            errors
        });
    }
    next();
}
exports.ValidateAdminSignIn = ValidateAdminSignIn;
function ValidateAdminPAsswordUpdate(req, res, next) {
    const { error } = validate_1.AdminPasswordUpdate.validate(req.body, validate_1.options);
    if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({
            errors
        });
    }
    next();
}
exports.ValidateAdminPAsswordUpdate = ValidateAdminPAsswordUpdate;
function generateTempPassword() {
    const length = 10; // choose the length of the password
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&#";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    retVal = retVal.slice(0, length - 4) + 'A' + 'a' + '1' + '@';
    return retVal;
}
exports.generateTempPassword = generateTempPassword;
exports.verifySignInLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many attempts from this IP, please try again after 15 minutes'
});
const isSuperAdmin = (req, res, next) => {
    try {
        // Get the JWT token from the cookie
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        let decoded;
        try {
            decoded = (0, token_1.verifyAdminToken)(token);
        }
        catch (error) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        const role = decoded.role;
        console.log(role);
        // Check if the role is superadmin or admin
        if (role !== 'Super Admin') {
            return res.status(403).json({ message: 'You are not authorized to access this route' });
        }
        // Proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
exports.isSuperAdmin = isSuperAdmin;
const isAdmin = (req, res, next) => {
    try {
        // Get the JWT token from the cookie
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        let decoded;
        try {
            decoded = (0, token_1.verifyAdminToken)(token);
        }
        catch (error) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        const role = decoded.role;
        console.log(role);
        // Check if the role is superadmin or admin
        if (role !== 'Super Admin' && role !== 'Admin') {
            return res.status(403).json({ message: 'You are not authorized to access this route' });
        }
        // Proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
exports.isAdmin = isAdmin;
