import express from 'express'
import { createCountry, getCountryById, getAllCountries, updateCountry } from '../../controllers/Admin/countries'
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
 *         description: Country already exists or Payment option is not available in this region
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
 * /api/v1/admin/countries:
 *   get:
 *     summary: Get all countries
 *     tags: [Admin Dashboards]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to return
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: The number of countries to return per page
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: The email to filter countries by
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name to filter countries by
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *         description: The currency to filter countries by
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: The search string to filter countries by
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: The date to filter countries by
 *     responses:
 *       '200':
 *         description: A list of countries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 totalCountries:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 countries:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Country'
 *       '404':
 *         description: No countries found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 error:
 *                   type: string
 *       '500':
 *         description: An error occurred while processing your request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 error:
 *                   type: string
 */
router.get('/countries', isAdmin, getAllCountries);

/**
 * @swagger
 * /api/v1/admin/country/{countryId}:
 *   get:
 *     summary: Retrieve a country by its ID.
 *     tags: [Admin Dashboards]
 *     parameters:
 *       - in: path
 *         name: countryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the country.
 *     responses:
 *       200:
 *         description: The country data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: The HTTP status code
 *                 data:
 *                   $ref: '#/components/schemas/Country'
 *       404:
 *         description: Country not found.
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
router.get('/country/:countryId', isAdmin, getCountryById);

/**
 * @swagger
 * /api/v1/admin/country/{countryId}:
 *   put:
 *     summary: Update a country
 *     tags: [Admin Dashboards]
 *     description: This endpoint allows an admin to update the details of a country.
 *     operationId: updateCountry
 *     parameters:
 *       - in: path
 *         name: countryId
 *         required: true
 *         type: string
 *         description: The ID of the country to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the country.
 *               email:
 *                 type: string
 *                 description: The new email of the country.
 *               currency:
 *                 type: string
 *                 description: The new currency of the country.
 *               usdConversionRatio:
 *                 type: number
 *                 description: The new USD conversion ratio of the country.
 *               distanceUnit:
 *                 type: string
 *                 description: The new distance unit of the country.
 *               paymentOption:
 *                 type: string
 *                 description: The new payment option of the country.
 *     responses:
 *       '200':
 *         description: Country updated successfully.
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
 *                   example: Country edited successfully
 *                 data:
 *                   $ref: '#/definitions/Country'
 *       '400':
 *         description: Payment option is not available in this region.
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
 *                   example: Payment option is not available in this region
 *       '404':
 *         description: Country not found.
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
 *                   example: Country not found
 *       '500':
 *         description: An error occurred while processing your request.
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
 */
router.put('/country/:countryId', isAdmin, updateCountry);


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