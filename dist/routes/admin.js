"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const admin_1 = require("../controllers/admin");
const middleware_1 = require("../utils/middleware");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
/**
 * @swagger
 * /admin/create:
 *   post:
 *     summary: Create a new admin
 *     security:
 *       - BearerAuth: {}
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
 *               $ref: '#/components/schemas/Admin'
 *       400:
 *         description: The admin with this email already exists
 *       500:
 *         description: Internal server error
 */
router.post('/create', middleware_1.isSuperAdmin, middleware_1.ValidateAdminSignup, admin_1.CreateAdmin);
/**
 * @swagger
 * /admin/signin:
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
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid password
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Error signing admin in
 */
router.post('/signin', middleware_1.ValidateAdminSignIn, admin_1.AdminLogin);
/**
 * @swagger
 * /admin/updatepassword:
 *   patch:
 *     summary: Change temporary password
 *     security:
 *       - BearerAuth: {}
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
 *       400:
 *         description: New password cannot be the same as the current password
 *       401:
 *         description: Invalid temporary password
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Error changing password
 */
router.patch('/updatepassword', middleware_1.isAdmin, middleware_1.ValidateAdminPAsswordUpdate, admin_1.changeTempPassword);
/**
 * @swagger
 * /admin/uploadpicture:
 *   patch:
 *     summary: Update admin profile picture
 *     security:
 *       - BearerAuth: {}
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
 *               $ref: '#/components/schemas/Admin'
 *       403:
 *         description: No token provided or Invalid or expired token
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Failed to upload image or Failed to update admin profile or Error updating profile picture
 */
router.patch('/uploadpicture', middleware_1.isAdmin, upload.single('profilePicture'), admin_1.updateProfilePicture);
/**
 * @swagger
 * /admin/statusupdate:
 *   post:
 *     summary: Toggle staff active status
 *     security:
 *       - BearerAuth: {}
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
 *               $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Invalid action
 *       403:
 *         description: No token provided
 *       404:
 *         description: Staff not found
 *       500:
 *         description: Error updating admin status
 */
router.patch('/statusupdate', middleware_1.isSuperAdmin, admin_1.toggleStaffActiveStatus);
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
 *           nullable: true
 *       required:
 *         - adminId
 *         - firstName
 *         - lastName
 *         - email
 *         - role
 *         - password
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - BearerAuth: []
 */
exports.default = router;
