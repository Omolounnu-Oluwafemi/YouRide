import express from 'express';
import multer from 'multer';
import { CreateAdmin, AdminLogin, changeTempPassword, updateProfilePicture, toggleStaffActiveStatus, getAllAdmins} from '../../controllers/Admin/admin'
import { ValidateAdminSignup, ValidateAdminSignIn, ValidateAdminPAsswordUpdate, isAdmin, isSuperAdmin } from '../../utils/middleware';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * /api/v1/admin/create:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
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
 *               role:
 *                 type: string
 *                 enum: [Admin, Super Admin]
 *               email:
 *                 type: string
 *             required:
 *               - firstName
 *               - lastName
 *               - role
 *               - email
 *     responses:
 *       201:
 *         description: The admin was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       400:
 *         description: The admin with this email already exists
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
 *                   description: The admin with this email already exists
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
 *                   description: Internal server error
 */
router.post('/create', ValidateAdminSignup, CreateAdmin);

/**
 * @swagger
 * /api/v1/admin/signin:
 *   post:
 *     summary: Login an admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
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
 *       401:
 *         description: Invalid password
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
 *                   description: Invalid password
 *       404:
 *         description: Admin not found
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
 *                   description: Admin not found
 *       500:
 *         description: Error signing admin in
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
 *                   description: Error signing admin in
 */
router.post('/signin', ValidateAdminSignIn, AdminLogin);

/**
 * @swagger
 * /api/v1/admin/updatepassword:
 *   patch:
 *     summary: Change temporary password
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               tempPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - email
 *               - tempPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   description: Password changed successfully
 *       400:
 *         description: New password cannot be the same as the current password
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
 *                   description: New password cannot be the same as the current password
 *       401:
 *         description: Invalid temporary password
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
 *                   description: Invalid temporary password
 *       404:
 *         description: Admin not found
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
 *                   description: Admin not found
 *       500:
 *         description: Error changing password
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
 *                   description: Error changing password
 */
router.patch('/updatepassword', isAdmin, ValidateAdminPAsswordUpdate, changeTempPassword);

/**
 * @swagger
 * /api/v1/admin/uploadpicture:
 *   patch:
 *     summary: Update admin profile picture
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties: 
 *               profilePicture:
 *                 type: string
 *                 format: binary      
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       403:
 *         description: No token provided or Invalid or expired token
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
 *                   description: No token provided or Invalid or expired token
 *       404:
 *         description: Admin not found
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
 *                   description: Admin not found
 *       500:
 *         description: Failed to upload image or Failed to update admin profile or Error updating profile picture
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
 *                   description: Failed to upload image or Failed to update admin profile or Error updating profile picture
 */
router.patch('/uploadpicture', isAdmin, upload.single('profilePicture'), updateProfilePicture);

/**
 * @swagger
 * /api/v1/admin/statusupdate:
 *   post:
 *     summary: Toggle staff active status
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [activate, deactivate]
 *             required:
 *               - action
 *     responses:
 *       200:
 *         description: Admin activated or deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Invalid action
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
 *                   description: Invalid action
 *       403:
 *         description: No token provided
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
 *                   description: No token provided
 *       404:
 *         description: Staff not found
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
 *                   description: Staff not found
 *       500:
 *         description: Error updating admin status
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
 *                   description: Error updating admin status
 */
router.patch('/statusupdate', isSuperAdmin, toggleStaffActiveStatus);

/**
 * @swagger
 * /api/v1/admin/admins:
 *   get:
 *     summary: Retrieve a list of admins
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: A list of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Admin'
 *       500:
 *         description: An error occurred while fetching the admins
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
router.get('/admins', isAdmin, getAllAdmins)

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         adminId:
 *           type: string
 *           description: Unique identifier for the admin
 *         firstName:
 *           type: string
 *           description: First name of the admin
 *         lastName:
 *           type: string
 *           description: Last name of the admin
 *         email:
 *           type: string
 *           description: Email of the admin
 *         role:
 *           type: string
 *           description: Role of the admin
 *           enum: [Super Admin, Admin]   
 *         image:
 *           type: string
 *           description: Image of the admin
 *           nullable: true
 *         password:
 *           type: string
 *           description: Password of the admin
 *         isActive:
 *           type: boolean
 *           description: Active status of the admin
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the admin was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the admin was last updated
 *       required:
 *         - adminId
 *         - firstName
 *         - lastName
 *         - email
 *         - role
 *         - password
 *         - isActive
 */

export default router;