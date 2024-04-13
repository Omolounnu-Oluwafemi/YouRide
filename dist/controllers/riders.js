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
exports.login = exports.DriverSignIn = exports.DriverSignup = void 0;
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const riders_1 = require("../models/riders");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const email_1 = require("../utils/email");
const token_1 = require("../utils/token");
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cloudinary_1.default.uploader.upload(file.path);
    return result.secure_url;
});
const DriverSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Generate rider ID
        const driverId = (0, uuid_1.v4)();
        // Extract rider data from request body
        const { phoneNumber, email, firstName, lastName, country, gender, category, referralCode, vehicleYear, vehicleManufacturer, vehicleColor, licensePlate, vehicleNumber, } = req.body;
        // Check if the email or phoneNumber already exists in the database
        const existingDriver = yield riders_1.Driver.findOne({
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
        const newDriver = yield riders_1.Driver.create({
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
            message: 'Rider created successfully',
            token: token,
            newDriver
        });
    }
    catch (error) {
        console.error(error);
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
        const user = yield riders_1.Driver.findOne({ where: { email, phoneNumber } });
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
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rider = yield Rider.findOne({ where: { email: req.body.email } });
        if (!rider) {
            return res.status(400).json({ error: 'User not found' });
        }
        const match = yield bcrypt_1.default.compare(req.body.password, rider.phoneNumber);
        if (!match) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        const token = jsonwebtoken_1.default.sign({ riderId: rider.riderId }, 'your-secret-key', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    }
    catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});
exports.login = login;
