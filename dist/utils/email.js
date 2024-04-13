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
exports.sendTemporaryPassword = exports.sendVerificationCode = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: 'YouRide Inc',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendEmail = sendEmail;
function sendVerificationCode(email, verificationCode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, exports.sendEmail)({
                email: email,
                subject: 'Verification Code', // Subject line
                message: `Your verification code is ${verificationCode}`,
                html: `<b>Your verification code is ${verificationCode}</b>`,
            });
            // Return true to indicate that the email was successssfully sent
            return true;
        }
        catch (error) {
            console.error('Email sending error:', error);
            // Return false to indicate that there was an error sending the email
            return false;
        }
    });
}
exports.sendVerificationCode = sendVerificationCode;
function sendTemporaryPassword(email, tempPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, exports.sendEmail)({
                email: email,
                subject: 'Your temporary password',
                message: `Your temporary password is ${tempPassword}. 
            Please change it as soon as possible.`,
                html: `<b>Your temporary password is ${tempPassword}</b>. Please change it as soon as possible`,
            });
            // Return true to indicate that the email was successssfully sent
            return true;
        }
        catch (error) {
            console.error('Email sending error:', error);
            // Return false to indicate that there was an error sending the email
            return false;
        }
    });
}
exports.sendTemporaryPassword = sendTemporaryPassword;
