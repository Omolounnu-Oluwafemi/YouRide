import { Request, Response, Router } from 'express';
import { Op } from 'sequelize'; 
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

export const getAllCountries = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const email = req.query.email || '';
        const name = req.query.name || '';
        const currency = req.query.currency || '';
        const search = req.query.search || '';
        let date = req.query.date ? new Date(req.query.date as string) : null;

         const whereClause: {
            email?: { [Op.like]: string },
            name?: { [Op.like]: string },
            currency?: { [Op.like]: string },
            createdAt?: { [Op.gte]: Date } | { [Op.between]: Date[] },
            [Op.or]?: {
                firstName?: { [Op.like]: string },
                name?: { [Op.like]: string },
                email?: { [Op.like]: string },
                currency?: {[Op.like]: string },
                driverLicense?: { [Op.like]: string }
            }
        } = {
            email: {
                [Op.like]: `%${email}%`
            },
            currency: {
                [Op.like]: `%${currency}%`
            },
            name: {
                [Op.like]: `%${name}%`
            }
         };
        
         if (search) {
            whereClause[Op.or] = {
                currency: { [Op.like]: `%${search}%` },
                name: { [Op.like]: `%${search}%` },
                email: { [Op.like]: `%${search}%` },
            };
        }

        if (date) {
            let startOfDay = new Date(date.setHours(0, 0, 0, 0));
            let endOfDay = new Date(date.setHours(23, 59, 59, 999));
            whereClause.createdAt = {
                [Op.between]: [startOfDay, endOfDay]
            }
        }

        const totalCountries = await Country.count({
            where: whereClause
        });

        if (totalCountries === 0) {
            return res.status(404).json({ error: 'No drivers found' });
        }
        const totalPages = Math.ceil(totalCountries / pageSize);

        const countries = await Country.findAll({
            where: whereClause,
            order: [
                ['createdAt', 'DESC']
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize
            });

        return res.status(200).json({
            totalCountries,
            totalPages,
            currentPage: page,
            pageSize,
            countries
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};

export const getCountryById = async (req: Request, res: Response) => {
  const { countryId } = req.params;

  try {
      const country = await Country.findOne({ where: { countryId } });

    if (!country) {
      return res.status(404).json({ status: 404, error: 'Country not found' });
    }

      return res.status(200).json({
              status: 200,
              data: country
          });
  } catch (error) {
      return res.status(500).json({
          status: 500,
          error: 'An error occurred while processing your request'
      });
  }
};