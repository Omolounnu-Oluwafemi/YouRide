import express from 'express';
import { initialSignUp, verifySignupCode, verifySigninCode, finalSignUp, signInUser } from '../controllers/usersController'; 
import { validateInitialSignUp, validateFinalSignUp, validateVerificationCode } from '../utils/middleware';

const router = express.Router();

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
router.post('/initialsignup', validateInitialSignUp, initialSignUp)

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
router.post('/verifysignup', validateVerificationCode, verifySignupCode)

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
router.post('/finalsignup', validateFinalSignUp, finalSignUp)

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
router.post('/signin', validateInitialSignUp, signInUser)

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
router.post('/verifysignin', validateVerificationCode, verifySigninCode)


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
export default router;