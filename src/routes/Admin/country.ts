import express from 'express'
import { createCountry } from '../../controllers/Admin/countries'
import { isAdmin, validateCountryCreation } from '../../utils/middleware'

const router = express.Router() 

/**
 * @swagger
 * /api/v1/admin/createCountry:
 *   post:
 *     summary: Create a new country
 *     tags: [Admin Dashboards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               currency:
 *                 type: string
 *               usdConversionRatio:
 *                 type: number
 *               distanceUnit:
 *                 type: string
 *                 enum: [KM, MI]
 *               paymentOption:
 *                 type: string
 *                 enum: [Stripe Payment, Paystack Payment]
 *             required:
 *               - name
 *               - email
 *               - currency
 *               - usdConversionRatio
 *               - distanceUnit
 *               - paymentOption
 *     responses:
 *       201:
 *         description: The country was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 data:
 *                   $ref: '#/components/schemas/Country'
 *       400:
 *         description: Country already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 error:
 *                   type: string
 *       500:
 *         description: An error occurred while processing your request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 error:
 *                   type: string
 */
router.post('/createCountry', isAdmin, validateCountryCreation, createCountry)

/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the country
 *         email:
 *           type: string
 *           description: The email of the country
 *         currency:
 *           type: string
 *           description: The currency of the country
 *         usdConversionRatio:
 *           type: number
 *           description: The USD conversion ratio of the country
 *         distanceUnit:
 *           type: string
 *           description: The distance unit of the country
 *           enum: [KM, MI]
 *         paymentOption:
 *           type: string
 *           description: The payment option of the country
 *           enum: [Stripe Payment, Paystack Payment]
 *       required:
 *         - name
 *         - email
 *         - currency
 *         - usdConversionRatio
 *         - distanceUnit
 *         - paymentOption
 *       example:
 *         name: 'Nigeria'
 *         email: 'country@example.com'
 *         currency: 'NGN'
 *         usdConversionRatio: 1500
 *         distanceUnit: 'KM'
 *         paymentOption: 'Paystack Payment'
 */

export default router;