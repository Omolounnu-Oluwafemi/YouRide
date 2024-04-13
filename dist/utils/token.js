"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = exports.verifyAdminToken = exports.signAdminToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generates a JSON Web Token (JWT) for a user.
const signToken = (id) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    if (!secret || !expiresIn) {
        throw new Error('JWT secret or expiration time not provided');
    }
    const token = jsonwebtoken_1.default.sign({ id }, secret, { expiresIn });
    return token;
};
exports.signToken = signToken;
const signAdminToken = (id, role) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    if (!secret || !expiresIn) {
        throw new Error('JWT secret or expiration time not provided');
    }
    const token = jsonwebtoken_1.default.sign({ id, role }, secret, { expiresIn });
    return token;
};
exports.signAdminToken = signAdminToken;
const verifyAdminToken = (token) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT secret not provided');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        console.error(error);
        throw new Error('Invalid token');
    }
};
exports.verifyAdminToken = verifyAdminToken;
const generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 9000);
};
exports.generateVerificationCode = generateVerificationCode;
