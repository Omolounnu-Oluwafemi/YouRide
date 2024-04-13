"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const middleware_1 = require("../utils/middleware");
const router = express_1.default.Router();
/**
 * @swagger
 * /user/initialsignup:
 *   post:
 *     summary: To signup as a Customer, you need to be verified.
 *     tags: [User]
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
 *     responses:
 *       200:
 *         description: Verification code sent succesfully
 */
router.post('/initialsignup', middleware_1.validateInitialSignUp, usersController_1.initialSignUp);
/**
 * @swagger
 * /user/verifysignup:
 *   post:
 *     summary: Verify the code sent to your email address
 *     tags: [User]
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
 *         description: User verified succesfully
 */
router.post('/verifysignup', middleware_1.validateVerificationCode, usersController_1.verifySignupCode);
/**
 * @swagger
 * /user/finalsignup:
 *   post:
 *     summary: Enter your Firstname and Lastname to create a user.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created succesfully
 */
router.post('/finalsignup', middleware_1.validateFinalSignUp, usersController_1.finalSignUp);
/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: To signin as a Customer, you need to be verified again.
 *     tags: [User]
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
 *     responses:
 *       200:
 *         description: Verification code sent succesfully
 */
router.post('/signin', middleware_1.validateInitialSignUp, usersController_1.signInUser);
/**
 * @swagger
 * /user/verifysignin:
 *   post:
 *     summary: Verify the code sent to your email address
 *     tags: [User]
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
 *         description: User verified succesfully
 */
router.post('/verifysignin', middleware_1.validateVerificationCode, usersController_1.verifySigninCode);
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the User
 *         firstName:
 *           type: string
 *           description: The firstname of the User
 *         lastName:
 *           type: string
 *           description: The lastname of the User
 *         phoneNumber:
 *           type: string
 *           description: The Phone Number of the User
 *         email:
 *           type: string
 *           format: email
 *           description: The Email of the User
 *       required:
 *         - userId
 *         - phonenumber
 *         - email
 *         - firstName
 *         - lastName
 */
exports.default = router;
