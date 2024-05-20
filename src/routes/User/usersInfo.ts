import express from 'express';
import { getAllUsers, deleteUser, updateUserProfile } from '../../controllers/User/usersInfo';
import multer from 'multer';
import { isAdmin, validateUserUpdateByAdmin, convertFilesToBase64 } from '../../utils/middleware';
import { getUserById } from '../../controllers/User/usersAuth';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /api/v1/admin/getallusers:
 *   get:
 *     summary: Retrieve a list of all users. Only accessible by admins.
 *     tags: [Admin Dashboards]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: The number of items per page.
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: The email to filter by.
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *         description: The phone number to filter by.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: The search term to filter by.
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: The exact creation date to filter by.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: An error occurred while processing your request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/getallusers', isAdmin, getAllUsers)

/**
 * @swagger
 * /api/v1/admin/getoneuser/{userId}:
 *   get:
 *     summary: Retrieve a user by their unique userId
 *     tags: [Admin Dashboards]
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
router.get('/getoneuser/:userId', isAdmin, getUserById);

/**
 * @swagger
 * /api/v1/admin/deleteuser/{userId}:
 *   delete:
 *     summary: Delete a user by ID. Only accessible by admins.
 *     tags: [Admin Dashboards]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
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
router.delete('/deleteuser/:userId', isAdmin, deleteUser)

/**
 * @swagger
 * /api/v1/admin/updateuser/{userId}:
 *   patch:
 *     summary: Admin endpoint to update user profile
 *     tags: [Admin Dashboards]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *                 description: The Country of the User
 *               firstName:
 *                 type: string
 *                 description: The First Name of the User
 *               lastName:
 *                 type: string
 *                 description: The Last Name of the User
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: The Profile Image of the User
 *               homeAddress:
 *                 type: string
 *                 description: The Home Address of the User
 *               dateOfBirth:
 *                 type: string
 *                 description: The Date of Birth of the User
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 description: The Status of the User
 *     responses:
 *       '200':
 *         description: User information updated successfully
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
 *                   example: User information updated successfully.
 *       '400':
 *         description: Invalid country
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: Invalid country
 *                 message:
 *                   type: string
 *                   example: We do not operate in this region yet.
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
 *                 message:
 *                   type: string
 *                   example: No user found with the provided userId
 *       '500':
 *         description: An error occurred while processing your request
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
 *                   example: An error occurred while processing your request
 *                 message:
 *                   type: string
 */
router.patch('/updateuser/:userId',isAdmin, upload.single('profileImage'), validateUserUpdateByAdmin, updateUserProfile);

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
