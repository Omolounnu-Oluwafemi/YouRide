import express from 'express';
import passport from 'passport';
import multer from 'multer';
import { initialSignUp, verifySignupCode, verifySigninCode, finalSignUp, signInUser, socialSignInUser, refreshToken, getUserById, editName, editPhoneNumber, editLocation,  addHomeAddress, addWorkAddress, communicationMethod, updateProfilePicture, userRating} from '../../controllers/User/usersAuth'; 
import { validateInitialSignUp, validateFinalSignUp, validateVerificationCode, validateEditPhoneNumber, validateEditLocation, validateHomeAddress, validateWorkAddress, validatecommunicationMethod, validateUserRating } from '../../utils/middleware';
import { deleteUser } from '../../controllers/User/usersInfo';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

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
 *                 description: The phone number of the user, including the country code
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *     responses:
 *       200:
 *         description: Verification code sent successfully
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
 *                     userId:
 *                       type: string
 *                     verificationCode:
 *                       type: string
 *       400:
 *         description: Email or phone number already exists, or country could not be detected from phone number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: An error occurred while sending code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 */
router.post('/initialsignup', validateInitialSignUp, initialSignUp);

/**
 * @swagger
 * /api/v1/user/verifySignupCode:
 *   post:
 *     summary: Verify the sign-up code and receive tokens directly.
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [verificationCode, userId]
 *             properties:
 *               verificationCode:
 *                 type: string
 *                 description: The verification code sent to your email.
 *               userId:
 *                 type: string
 *                 description: The user's ID
 *     responses:
 *       200:
 *         description: Verification successful
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
 *       400:
 *         description: Invalid verification code or user ID
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
router.post('/verifySignupCode', validateVerificationCode, verifySignupCode);

/**
 * @swagger
 * /api/v1/user/finalSignup:
 *   post:
 *     summary: Register a new user with their first name and last name.
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, userId]
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the user.
 *               lastName:
 *                 type: string
 *                 description: The last name of the user.
 *               userId:
 *                 type: string
 *                 description: The user's ID.
 *     responses:
 *       200:
 *         description: User updated successfully.
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
 *                 token:
 *                   type: string
 *                   description: The JWT token
 *                 refreshToken:
 *                   type: string
 *                   description: The refresh token
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User not found or missing required fields.
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
 *                   description: The error message
 */
router.post('/finalSignup', validateFinalSignUp, finalSignUp);

/**
 * @swagger
 * /api/v1/user/signIn:
 *   post:
 *     summary: Sign in as a user.
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phoneNumber, email]
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the user.
 *               email:
 *                 type: string
 *                 description: The email of the user.
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
 *                       description: The verification code sent to the user's email
 *                     userId:
 *                       type: string
 *                       description: The user's ID
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
router.post('/signin', validateInitialSignUp, signInUser);

/**
 * @swagger
 * /api/v1/user/verifySigninCode:
 *   post:
 *     summary: Verify the signin code for a user.
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [verificationCode, userId]
 *             properties:
 *               verificationCode:
 *                 type: string
 *                 description: The verification code of the user.
 *               userId:
 *                 type: string
 *                 description: The ID of the user.
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
 *                 token:
 *                   type: string
 *                   description: The JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: The JWT refresh token
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       description: The user object
 *       400:
 *         description: Verification not successful
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
router.post('/verifySigninCode', validateVerificationCode, verifySigninCode);

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
 * /api/v1/user/getoneuser:
 *   post:
 *     summary: Retrieve a user by their unique userId
 *     tags: [User Account]
 *     description: This endpoint retrieves a user's details using their unique identifier (userId).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The unique identifier of the user
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
router.post('/getoneuser', getUserById);

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
 * /api/v1/user/editName:
 *   patch:
 *     summary: Update user's first name and last name
 *     tags: [User Account]
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
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User name updated successfully
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
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: An error occurred while updating the user name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 */
router.patch('/editName', validateFinalSignUp, editName);

/**
 * @swagger
 * /api/v1/user/editPhoneNumber:
 *   patch:
 *     summary: Update user's phone number
 *     tags: [User Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Phone number updated successfully
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
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: An error occurred while updating Phone number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 */
router.patch('/editPhoneNumber', validateEditPhoneNumber, editPhoneNumber);

/**
 * @swagger
 * /api/v1/user/editLocation:
 *   patch:
 *     summary: Update user's country and state
 *     tags: [User Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User location updated successfully
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
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: An error occurred while updating the user location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 */
router.patch('/editLocation', validateEditLocation, editLocation);

/**
 * @swagger
 * /api/v1/user/addHomeAddress:
 *   patch:
 *     summary: Add home address for a user
 *     description: This endpoint adds a home address for a user.
 *     tags: [User Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to add the home address for.
 *               homeAddress:
 *                 type: string
 *                 description: The home address to add.
 *     responses:
 *       '200':
 *         description: Home address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Home address added successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User not found
 *       '500':
 *         description: An error occurred while adding the home address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: An error occurred while adding the home address
 */
router.patch('/addHomeAddress', validateHomeAddress, addHomeAddress);

/**
 * @swagger
 * /api/v1/user/addWorkAddress:
 *   patch:
 *     summary: Add Work address for a user
 *     description: This endpoint adds a work address for a user.
 *     tags: [User Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to add the work address for.
 *               workAddress:
 *                 type: string
 *                 description: The work address to add.
 *     responses:
 *       '200':
 *         description: Work address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Work address added successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User not found
 *       '500':
 *         description: An error occurred while adding the work address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: An error occurred while adding the work address
 */
router.patch('/addWorkAddress', validateWorkAddress, addWorkAddress);

/**
 * @swagger
 * /api/v1/user/communication:
 *   patch:
 *     summary: Update communication method for a user
 *     description: This endpoint updates the communication method for a user.
 *     tags: [User Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to update the communication method for.
 *               communicationMethod:
 *                 type: string
 *                 description: The new communication method.
 *     responses:
 *       '200':
 *         description: Communication method updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Communication method updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User not found
 *       '500':
 *         description: An error occurred while updating the communication method
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: An error occurred while updating the communication method
 */
router.patch('/communication', validatecommunicationMethod, communicationMethod)

/**
 * @swagger
 * /api/v1/user/uploadpicture:
 *   patch:
 *     summary: Update profile picture for a user
 *     description: This endpoint updates the profile picture for a user.
 *     tags: [User Account]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Profile picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Profile picture updated successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 error:
 *                   type: string
 *                   example: User not found
 *       '500':
 *         description: An error occurred while updating the profile picture
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: An error occurred while updating the profile picture
 */
router.patch('/uploadpicture', upload.single('profileImage'), updateProfilePicture);

/**
 * @swagger
 * /api/v1/user/rating:
 *   patch:
 *     summary: Rate a user
 *     tags: [User Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The user ID
 *               rating:
 *                 type: integer
 *                 description: The rating to give the user
 *     responses:
 *       200:
 *         description: The user was successfully rated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The status code
 *                 message:
 *                   type: string
 *                   description: The status message
 *                 newAverageRating:
 *                   type: number
 *                   description: The new average rating of the user
 *       404:
 *         description: The user was not found
 *       500:
 *         description: There was an error rating the user
 */
router.patch('/rating',validateUserRating,  userRating);

/**
 * @swagger
 * /api/v1/user/delete:
 *   delete:
 *     summary: Delete a user
 *     description: This endpoint deletes a user from the system.
 *     tags: [User Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to delete.
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User not found
 *       '500':
 *         description: An error occurred while deleting the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: An error occurred while deleting the user
 */
router.delete('/deleteuser', deleteUser)

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
 *         phoneNumber:
 *           type: string
 *           nullable: true
 *         email:
 *           type: string
 *           format: email
 *         country:
 *           type: string
 *         state:
 *           type: string
 *           nullable: true
 *         firstName:
 *           type: string
 *           nullable: true
 *         lastName:
 *           type: string
 *           nullable: true
 *         referralCount:
 *           type: integer
 *           default: 0
 *         ssoProvider:
 *           type: string
 *           nullable: true
 *         googleId:
 *           type: string
 *           nullable: true
 *         facebookId:
 *           type: string
 *           nullable: true
 *         appleId:
 *           type: string
 *           nullable: true
 *         verificationCode:
 *           type: string
 *           nullable: true
 *         userRating:
 *           type: number
 *           default: 0
 *           nullable: true
 *         numberOfRatings:
 *           type: integer
 *           default: 0
 *           nullable: true
 *         profileImage:
 *           type: string
 *           nullable: true
 *         communicationMethod:
 *           type: string
 *           enum: ['Call', 'Chat', 'Call or Chat']
 *           nullable: true
 *         workAddress:
 *           type: string
 *           nullable: true
 *         homeAddress:
 *           type: string
 *           nullable: true
 *         wallet:
 *           type: number
 *           default: 0
 *         status:
 *           type: string
 *           enum: ['Active', 'Inactive']
 *           default: 'Active'
 *         dateOfBirth:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - userId
 *         - email
 *         - country
 *         - wallet
 *         - status
 */

export default router;