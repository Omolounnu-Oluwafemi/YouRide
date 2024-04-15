"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
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
 * /user/signin:
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
 * /verifySigninCode:
 *   post:
 *     summary: Verify the sign-in code
 *     tags: [User]
 *     description: Verifies the sign-in code sent to the user's email. If the code is valid and the user exists, a token is returned in a cookie.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verificationCode:
 *                 type: string
 *                 description: The verification code sent to the user's email
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the operation
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: User object
 *       '400':
 *         description: Invalid verification code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                 error:
 *                   type: string
 *                   description: Error details
 *       '500':
 *         description: An error occurred while verifying the code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.post('/verifysignin', middleware_1.validateVerificationCode, usersController_1.verifySigninCode);
/**
 * @swagger
 * /user/google:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Google OAuth2.0 authentication
 *     description: Redirects the user to Google for OAuth2.0 authentication. After successful authentication, Google redirects the user back to this endpoint with an authorization code. This endpoint then exchanges the authorization code for an access token.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: User object
 *       400:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: An error occurred while sending code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/redirect', passport_1.default.authenticate('google', { failureRedirect: '/' }), usersController_1.socialSignInUser);
/**
 * @swagger
 * /user/facebook:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Facebook authentication
 *     description: Redirects the user to Facebook authentication. After successful authentication, Facebook redirects the user back to this endpoint with an authorization code. This endpoint then exchanges the authorization code for an access token.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: User object
 *       400:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: An error occurred while sending code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.get('/facebook', passport_1.default.authenticate('facebook'));
router.get('/facebook/redirect', passport_1.default.authenticate('facebook', { failureRedirect: '/' }), usersController_1.socialSignInUser);
/**
 * @swagger
 * /user/apple:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Apple authentication
 *     description: Redirects the user to Apple for authentication. After successful authentication, Apple redirects the user back to this endpoint with an authorization code. This endpoint then exchanges the authorization code for an access token.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: User object
 *       400:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: An error occurred while sending code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.get('/apple', passport_1.default.authenticate('apple'));
router.get('/apple/redirect', passport_1.default.authenticate('apple', { failureRedirect: '/' }), usersController_1.socialSignInUser);
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
 *         googleId:
 *           type: string
 *           description: The GoogleID of the User
 *         facebookId:
 *           type: string
 *           description: The FacebookID of the User
 *         appleId:
 *           type: string
 *           description: The AppleID of the User
 *       required:
 *         - userId
 *         - phonenumber
 *         - email
 *         - firstName
 *         - lastName
 */
exports.default = router;
