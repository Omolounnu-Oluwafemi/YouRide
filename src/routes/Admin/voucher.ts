import express from 'express';
import { createVoucher } from '../../controllers/Admin/voucher';
import { isAdmin } from '../../utils/middleware';

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/voucher:
 *   post:
 *     summary: Create a new voucher
 *     security: 
 *       - BearerAuth: {}
 *     tags: [Voucher]
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
 *               $ref: '#/components/schemas/Voucher'
 *       500:
 *         description: Internal server error
 */
router.post('/voucher', isAdmin, createVoucher);

export default router;