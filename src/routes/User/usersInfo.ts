import express from 'express';
import { getAllUsers } from '../../controllers/User/usersInfo';
import { isAdmin } from '../../utils/middleware';

const router = express.Router();

/**
 * @swagger
 * /api/v1/user/getallusers:
 *   get:
 *     summary: Retrieve a list of all users. Only accessible by admins.
 *     tags: [User]
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
 *               type: array
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 data:
 *                   $ref: '#/components/schemas/User'
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
router.get('/getallusers', isAdmin, getAllUsers)

export default router;
