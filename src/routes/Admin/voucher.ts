import express from 'express';
import { createVoucher } from '../../controllers/Admin/voucher';
import { isAdmin } from '../../utils/middleware';

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/voucher:
 *   post:
 *     summary: Create a new voucher
 *     tags: [ Admin Create Voucher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *               couponCode:
 *                 type: string
 *               description:
 *                 type: string
 *               usageLimit:
 *                 type: number
 *               perUserLimit:
 *                 type: number
 *               discount:
 *                 type: number
 *               activationDate:
 *                 type: string
 *               expiryDate:
 *                 type: string
 *               validity:
 *                 type: string
 *                 enum: [parmanent, custom]
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *             required:
 *               - couponCode
 *               - usageLimit
 *               - perUserLimit
 *               - discount
 *               - activationDate
 *               - expiryDate
 *               - validity
 *               - status
 *     responses:
 *       201:
 *         description: The voucher was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 data:
 *                   $ref: '#/components/schemas/Voucher'
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
router.post('/voucher', isAdmin, createVoucher);

/**
 * @swagger
 * components:
 *   schemas:
 *     Voucher:
 *       type: object
 *       required:
 *         - voucherId
 *         - couponCode
 *         - usageLimit
 *         - perUserLimit
 *         - discount
 *         - activationDate
 *         - expiryDate
 *         - validity
 *         - status
 *       properties:
 *         voucherId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the voucher.
 *         country:
 *           type: string
 *           description: The country where the voucher is valid.
 *         couponCode:
 *           type: string
 *           description: The code that users enter to redeem the voucher.
 *         description:
 *           type: string
 *           description: A description of the voucher.
 *         usageLimit:
 *           type: integer
 *           description: The total number of times the voucher can be used.
 *         perUserLimit:
 *           type: integer
 *           description: The number of times a single user can use the voucher.
 *         discount:
 *           type: number
 *           format: float
 *           description: The discount percentage provided by the voucher.
 *         activationDate:
 *           type: string
 *           format: date-time
 *           description: The date when the voucher becomes active.
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           description: The date when the voucher expires.
 *         validity:
 *           type: string
 *           enum: [permanent, custom]
 *           description: The validity period of the voucher.
 *         status:
 *           type: string
 *           enum: [active, inactive, expired]
 *           description: The current status of the voucher.
 */

export default router;