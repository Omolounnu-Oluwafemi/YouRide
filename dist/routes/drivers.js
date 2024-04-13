"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const drivers_1 = require("../controllers/drivers");
const middleware_1 = require("../utils/middleware");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
/**
 * @swagger
 * /driver/signup:
 *   post:
 *     summary: Register a new driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               country:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               category:
 *                 type: string
 *                 enum: [Private Driver, Taxi Driver, Delivery Driver]
 *               referralCode:
 *                 type: string
 *               vehicleYear:
 *                 type: string
 *                 enum: ['2024', '2023', '2022', '2021', '2020', '2019', '2018']
 *               vehicleManufacturer:
 *                 type: string
 *                 enum: ['ACE', 'Acura', 'AIWAYS', 'AKT', 'BMW', 'BYD', 'Chevrolet']
 *               vehicleColor:
 *                 type: string
 *               licensePlate:
 *                 type: string
 *               vehicleNumber:
 *                 type: string
 *               driverLicense:
 *                 type: string
 *                 format: binary
 *               vehicleLogBook:
 *                 type: string
 *                 format: binary
 *               privateHireLicenseBadge:
 *                 type: string
 *                 format: binary
 *               insuranceCertificate:
 *                 type: string
 *                 format: binary
 *               motTestCertificate:
 *                 type: string
 *                 format: binary
 *             required:
 *               - phoneNumber
 *               - country
 *               - email
 *               - firstName
 *               - lastName
 *               - gender
 *               - category
 *               - vehicleYear
 *               - vehicleManufacturer
 *               - vehicleColor
 *               - licensePlate
 *               - vehicleNumber
 *               - driverLicense
 *               - vehicleLogBook
 *               - privateHireLicenseBadge
 *               - insuranceCertificate
 *               - motTestCertificate
 *     responses:
 *       201:
 *         description: Driver created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/signup', upload.fields([
    { name: 'driverLicense', maxCount: 1 },
    { name: 'vehicleLogBook', maxCount: 1 },
    { name: 'privateHireLicenseBadge', maxCount: 1 },
    { name: 'insuranceCertificate', maxCount: 1 },
    { name: 'motTestCertificate', maxCount: 1 }
]), middleware_1.ValidateDriverSignup, drivers_1.DriverSignup);
/**
 * @swagger
 * /driver/signin:
 *   post:
 *     summary: Sign in a driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification code sent to your email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     verificationCode:
 *                       type: string
 *       400:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: An error occurred while sending code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/signin', middleware_1.validateInitialSignUp, drivers_1.DriverSignIn);
/**
 * @swagger
 * /driver/verify:
 *   post:
 *     summary: Verify a driver's sign in
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verificationCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Invalid verification code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *       500:
 *         description: An error occurred while verifying the code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/verify', middleware_1.validateVerificationCode, middleware_1.verifySignInLimiter, drivers_1.verifyDriverSignIn);
/**
 * @swagger
 * components:
 *   schemas:
 *     Driver:
 *       type: object
 *       required:
 *         - driverId
 *         - phoneNumber
 *         - country
 *         - email
 *         - firstName
 *         - lastName
 *         - gender
 *         - category
 *         - vehicleYear
 *         - vehicleManufacturer
 *         - vehicleColor
 *         - licensePlate
 *         - vehicleNumber
 *         - driverLicense
 *         - vehicleLogBook
 *         - privateHireLicenseBadge
 *         - insuranceCertificate
 *         - motTestCertificate
 *       properties:
 *         driverId:
 *           type: string
 *           format: uuid
 *         phoneNumber:
 *           type: string
 *         country:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other]
 *         category:
 *           type: string
 *           enum: [Private Driver, Taxi Driver, Delivery Driver]
 *         referralCode:
 *           type: string
 *         vehicleYear:
 *           type: string
 *           enum: ['2024', '2023', '2022', '2021', '2020', '2019', '2018']
 *         vehicleManufacturer:
 *           type: string
 *           enum: ['ACE', 'Acura', 'AIWAYS', 'AKT', 'BMW', 'BYD', 'Chevrolet']
 *         vehicleColor:
 *           type: string
 *         licensePlate:
 *           type: string
 *         vehicleNumber:
 *           type: string
 *         driverLicense:
 *           type: string
 *         vehicleLogBook:
 *           type: string
 *         privateHireLicenseBadge:
 *           type: string
 *         insuranceCertificate:
 *           type: string
 *         motTestCertificate:
 *           type: string
 */
exports.default = router;
