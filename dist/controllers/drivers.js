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
exports.verifyDriverSignIn = exports.DriverSignIn = exports.DriverSignup = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const drivers_1 = require("../models/drivers");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const email_1 = require("../utils/email");
const token_1 = require("../utils/token");
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cloudinary_1.default.uploader.upload(file.path);
    return result.secure_url;
});
const DriverSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Generate driver ID
        const driverId = (0, uuid_1.v4)();
        // Extract driver data from request body
        const { phoneNumber, email, firstName, lastName, country, gender, category, referralCode, vehicleYear, vehicleManufacturer, vehicleColor, licensePlate, vehicleNumber, } = req.body;
        // Check if the email or phoneNumber already exists in the database
        const existingDriver = yield drivers_1.Driver.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { email: req.body.email },
                    { phoneNumber: req.body.phoneNumber }
                ]
            }
        });
        if (existingDriver) {
            let message = '';
            if (existingDriver.email === req.body.email) {
                message = 'Email already exists';
            }
            else if (existingDriver.phoneNumber === req.body.phoneNumber) {
                message = 'Phone number already exists';
            }
            return res.status(400).json({ message });
        }
        // Check if all required files are present
        const requiredFiles = ['driverLicense', 'vehicleLogBook', 'privateHireLicenseBadge', 'insuranceCertificate', 'motTestCertificate'];
        for (const file of requiredFiles) {
            if (!req.files || !req.files[file] || req.files[file].length === 0) {
                return res.status(400).json({ error: `${file} file is missing` });
            }
        }
        // Upload files to Cloudinary and obtain URLs
        const driverLicenseUrl = yield uploadToCloudinary(req.files['driverLicense'][0]);
        const vehicleLogBookUrl = yield uploadToCloudinary(req.files['vehicleLogBook'][0]);
        const privateHireLicenseBadgeUrl = yield uploadToCloudinary(req.files['privateHireLicenseBadge'][0]);
        const insuranceCertificateUrl = yield uploadToCloudinary(req.files['insuranceCertificate'][0]);
        const motTestCertificateUrl = yield uploadToCloudinary(req.files['motTestCertificate'][0]);
        // Generate a JWT token for the user
        const token = (0, token_1.signToken)(driverId);
        // Create new Rider instance in database
        const newDriver = yield drivers_1.Driver.create({
            driverId,
            phoneNumber,
            email,
            country,
            firstName,
            lastName,
            gender,
            category,
            referralCode,
            vehicleYear,
            vehicleManufacturer,
            vehicleColor,
            licensePlate,
            vehicleNumber,
            driverLicense: driverLicenseUrl,
            vehicleLogBook: vehicleLogBookUrl,
            privateHireLicenseBadge: privateHireLicenseBadgeUrl,
            insuranceCertificate: insuranceCertificateUrl,
            motTestCertificate: motTestCertificateUrl
        });
        // Send response
        res.status(201).json({
            message: 'Driver created successfully',
            token: token,
            newDriver
        });
    }
    catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: error.message });
        }
    }
});
exports.DriverSignup = DriverSignup;
const DriverSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber, email } = req.body;
        // Check if the email and the phone number already exists in the database
        const user = yield drivers_1.Driver.findOne({ where: { email, phoneNumber } });
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
            message: 'Verification code sent to your email',
            data: { verificationCode }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while sending code' });
    }
});
exports.DriverSignIn = DriverSignIn;
function verifyDriverSignIn(req, res) {
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
            const driver = yield drivers_1.Driver.findOne({ where: { email: req.session.email, phoneNumber: req.session.phoneNumber } });
            if (!driver) {
                return res.status(404).json({
                    message: 'Sign up instead?',
                    error: 'User not found',
                });
            }
            const token = (0, token_1.signToken)(driver.driverId);
            // Set the token in a cookie
            res.cookie('token', token, { httpOnly: true });
            return res.status(200).json({
                status: 'success',
                message: 'User signed in successfully',
                data: { driver }
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while verifying the code' });
        }
    });
}
exports.verifyDriverSignIn = verifyDriverSignIn;
;
