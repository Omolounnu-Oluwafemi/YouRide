import express from 'express';
import { createPaymentOption, getAllPaymentOptions, updatePaymentOptionKeys, paymentOptionAvailability  } from '../../controllers/Admin/paymentOptions';
import { validatepaymentOptionCreation, validatepaymentOptionKeys, isAdmin } from '../../utils/middleware';

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/paymentoption:
 *   post:
 *     summary: Create a new payment option
 *     tags: [Admin Dashboards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentName:
 *                 type: string
 *                 description: The name of the payment option.
 *               privateKey:
 *                 type: string
 *                 description: The private key for the payment option.
 *               publicKey:
 *                 type: string
 *                 description: The public key for the payment option.
 *             required:
 *               - paymentName
 *               - privateKey
 *               - publicKey
 *     responses:
 *       '201':
 *         description: Payment option created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Payment option created successfully.
 *                 data:
 *                   $ref: '#/components/schemas/PaymentOption'
 *       '400':
 *         description: Bad request. User sent invalid data.
 *       '500':
 *         description: Internal server error.
 */
router.post('/paymentoption', isAdmin, validatepaymentOptionCreation, createPaymentOption);

/**
 * @swagger
 * /api/v1/admin/paymentoptions:
 *   get:
 *     summary: Retrieve a list of all payment options
 *     tags: [Admin Dashboards]
 *     responses:
 *       '200':
 *         description: A list of payment options.
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
 *                   example: Payment options retrieved successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PaymentOption'
 *       '500':
 *         description: Internal server error.
 */
router.get('/paymentoptions', isAdmin, getAllPaymentOptions);

/**
 * @swagger
 * /api/v1/admin/paymentkeys/{paymentOptionId}:
 *   patch:
 *     summary: Update a payment option
 *     tags: [Admin Dashboards]
 *     parameters:
 *       - in: path
 *         name: paymentOptionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the payment option to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               privateKey:
 *                 type: string
 *                 description: The private key for the payment option.
 *               publicKey:
 *                 type: string
 *                 description: The public key for the payment option.
 *     responses:
 *       '200':
 *         description: Payment option updated successfully.
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
 *                   example: Payment option updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/PaymentOption'
 *       '400':
 *         description: Bad request. User sent invalid data.
 *       '500':
 *         description: Internal server error.
 */
router.patch('/paymentkeys/:paymentOptionId', isAdmin, validatepaymentOptionKeys, updatePaymentOptionKeys);

/**
 * @swagger
 * /api/v1/admin/paymentoptionavailabity/{paymentOptionId}:
 *   patch:
 *     summary: Update the availability of a payment option
 *     tags: [Admin Dashboards]
 *     parameters:
 *       - in: path
 *         name: paymentOptionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the payment option to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentAvailable:
 *                 type: boolean
 *                 description: Whether the payment option is available.
 *     responses:
 *       '200':
 *         description: Payment option availability updated successfully.
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
 *                   example: Payment option availability updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/PaymentOption'
 *       '400':
 *         description: Bad request. User sent invalid data.
 *       '500':
 *         description: Internal server error.
 */
router.patch('/paymentoptionavailabity/:paymentOptionId', isAdmin, paymentOptionAvailability);

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentOption:
 *       type: object
 *       properties:
 *         paymentOptionId:
 *           type: string
 *           description: The auto-generated id of the payment option.
 *         paymentName:
 *           type: string
 *           description: The name of the payment option.
 *         privateKey:
 *           type: string
 *           description: The private key for the payment option.
 *         publicKey:
 *           type: string
 *           description: The public key for the payment option.
 *         paymentAvailable:
 *           type: boolean
 *           description: Whether the payment option is available.
 *       example:
 *         paymentOptionId: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         paymentName: "Visa"
 *         privateKey: "privateKey123"
 *         publicKey: "publicKey123"
 *         paymentAvailable: true
 */

export default router;