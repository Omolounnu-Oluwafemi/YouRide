import express from 'express'; 
import passport from 'passport';
import { initialSignUp, verifySignupCode, verifySigninCode, finalSignUp, signInUser, socialSignInUser, refreshToken, getUserById } from '../../controllers/User/usersAuth'; 
import { validateInitialSignUp, validateFinalSignUp, validateVerificationCode} from '../../utils/middleware';
import { deleteUser } from '../../controllers/User/usersInfo';

const router = express.Router();

/**
 * @swagger
 * /api/v1/user/initialsignup:
 *   post:
 *     summary: To signup as a Customer, you need to be verified.
 *     tags: [User Authentication]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: The response message
 */
router.post('/initialsignup', validateInitialSignUp, initialSignUp)

/**
 * @swagger
 * /api/v1/user/verifySignupCode:
 *   post:
 *     summary: Verify the sign-in code and receive tokens directly.
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [verificationCode]
 *             properties:
 *               verificationCode:
 *                 type: string
 *                 description: The verification code sent to your email.
 *     responses:
 *       200:
 *         description: Verification successful, user signed in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: The response message
 *                 email:
 *                   type: string
 *                   description: The user's email
 *                 phoneNumber:
 *                   type: string
 *                   description: The user's phone number
 *       400:
 *         description: Invalid verification code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: The error message
 *       500:
 *         description: An error occurred while verifying the code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.post('/verifySignupCode', validateVerificationCode, verifySignupCode)

/**
 * @swagger
 * /api/v1/user/finalsignup:
 *   post:
 *     summary: Register a new user with their first name and last name.
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName]
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the user.
 *               lastName:
 *                 type: string
 *                 description: The last name of the user.
 *     responses:
 *       201:
 *         description: New User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.post('/finalsignup', validateFinalSignUp, finalSignUp);

/**
 * @swagger
 * /api/v1/user/signIn:
 *   post:
 *     summary: Sign in as a Customer.
 *     tags: [User Authentication]
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
 *         description: Verification code sent to email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: The response message
 *                 data:
 *                   type: object
 *                   properties:
 *                     verificationCode:
 *                       type: string
 *                       description: The verification code
 *       400:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: The error message
 *       500:
 *         description: An error occurred while sending code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.post('/signin', validateInitialSignUp, signInUser)

/**
 * @swagger
 * /api/v1/user/verifySigninCode:
 *   post:
 *     summary: Verify the signin code for a Customer.
 *     tags: [User Authentication]
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
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: The response message
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: The user object
 *       400:
 *         description: Invalid verification code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: The error message
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: The error message
 *                 error:
 *                   type: string
 *                   description: The error details
 *       500:
 *         description: An error occurred while verifying the code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: The error message
 */
router.post('/verifySigninCode', validateVerificationCode, verifySigninCode)

/**
 * @swagger
 * /api/v1/user/google:
 *   get:
 *     tags:
 *       - User Social Authentication
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
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
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
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
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
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/redirect',
  passport.authenticate('google', { failureRedirect: '/' }),
  socialSignInUser
);

/**
 * @swagger
 * /api/v1/user/facebook:
 *   get:
 *     tags:
 *       - User Social Authentication
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
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
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
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
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
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.get('/facebook', passport.authenticate('facebook'))

router.get('/facebook/redirect',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  socialSignInUser
);

/**
 * @swagger
 * /api/v1/user/apple:
 *   get:
 *     tags:
 *       - User Social Authentication
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
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
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
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
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
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.get('/apple', passport.authenticate('apple'))

router.get('/apple/redirect',
  passport.authenticate('apple', { failureRedirect: '/' }),
  socialSignInUser
);

/**
 * @swagger
 * /api/v1/user/getoneuser/{userId}:
 *   get:
 *     summary: Retrieve a user by their unique userId
 *     tags: [User Account]
 *     description: This endpoint retrieves a user's details using their unique identifier (userId).
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: User ID is required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: User not found
 *       500:
 *         description: An error occurred while retrieving user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: An error occurred while retrieving user
 */
router.get('/getoneuser/:userId', getUserById);

/**
 * @swagger
 * /api/v1/user/refresh-token:
 *   post:
 *     summary: Refresh the authentication token
 *     tags: [User Authentication]
 *     description: This endpoint is used to refresh the authentication token when it expires.
 *     operationId: refreshToken
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token received during login or previous token refresh.
 *     responses:
 *       '200':
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                 newToken:
 *                   type: string
 *                   description: The new JWT token
 *                 newRefreshToken:
 *                   type: string
 *                   description: The new refresh token
 *       '403':
 *         description: Invalid or expired refresh token, or User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 error:
 *                   type: string
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /api/v1/user/deleteuser/{id}:
 *   delete:
 *     summary: Delete a user by ID. Only accessible by admins.
 *     tags: [User Account]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 message:
 *                   type: string
 *                   description: The success message
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 error:
 *                   type: string
 *                   description: The error message
 *       500:
 *         description: An error occurred while processing your request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 error:
 *                   type: string
 *                   description: The error message
 */
router.delete('/deleteuser/:userId', deleteUser)


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
export default router;