import express from 'express';
import passport from 'passport';
import { initialSignUp, verifySignupCode, verifySigninCode, finalSignUp, signInUser, googleSignInUser } from '../controllers/usersController'; 
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

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// router.get('/google/redirect', function(req, res, next) {
//   passport.authenticate('google', function(err, user, info) {
//     if (err) { 
//       console.error('Error in passport.authenticate:', err);
//       return next(err); 
//     }
//     if (!user) { 
//       console.log('No user returned from Google:', info);
//       return res.redirect('/login'); 
//     }
//       req.logIn(user, function (err) {
//         console.log('Logging in user:', user);
//         if (err) { 
//         console.error('Error logging in user:', err);
//         return next(err); 
//       }
//       return res.redirect('/user/' + user.username);
//     });
//   })(req, res, next);
// }, googleSignInUser);
router.get('/google/redirect',
  passport.authenticate('google', { failureRedirect: '/' }),
  googleSignInUser
);

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