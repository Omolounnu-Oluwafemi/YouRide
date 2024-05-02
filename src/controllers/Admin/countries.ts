import { Request, Response, Router } from 'express';
import { Country } from '../../models/countries';

export const createCountry =  async (req: Request, res: Response) => {
    try {
        const { name, email, currency, usdConversionRatio, distanceUnit, paymentOption } = req.body;

         const existingCountry = await Country.findOne({ where: { name } });
        if (existingCountry) {
            return res.status(400).json({ error: 'Country already exists' });
        }

        const country = await Country.create({
            name,
            email,
            currency,
            usdConversionRatio,
            distanceUnit,
            paymentOption
        });

        return res.status(201).json(country);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};