import { Request, Response } from 'express';
import { Op } from 'sequelize'; 
import { Trip } from '../../models/trip';

export const getAllTrips = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const driverName = req.query.driverName || '';
        const userName = req.query.userName || '';
        const search = req.query.search || '';
        const status = req.query.status || '';
        const country = req.query.country || '';
        let date = req.query.date ? new Date(req.query.date as string) : null;

        const whereClause: any = {
            status: status
        };

        if (driverName) {
            whereClause.driverName = { [Op.like]: `%${driverName}%` };
        }

        if (userName) {
            whereClause.userName = { [Op.like]: `%${userName}%` };
        }

        if (country) {
            whereClause.country = { [Op.like]: `%${country}%` };
        }

        if (search) {
            whereClause[Op.or] = [
                { country: { [Op.like]: `%${search}%` } },
                { driverName: { [Op.like]: `%${search}%` } },
                { userName: { [Op.like]: `%${search}%` } },
            ];
        }

        if (date) {
            let startOfDay = new Date(date.setHours(0, 0, 0, 0));
            let endOfDay = new Date(date.setHours(23, 59, 59, 999));
            whereClause.createdAt = {
                [Op.between]: [startOfDay, endOfDay]
            }
        }

        const totalTrips = await Trip.count({
            where: whereClause
        });

        if (totalTrips === 0) {
            return res.status(404).json({
                status: 404,
                error: 'No trips found'
            });
        }
        const totalPages = Math.ceil(totalTrips / pageSize);

        const trips = await Trip.findAll({
            where: whereClause,
            order: [
                ['createdAt', 'DESC']
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize
        });

        return res.status(200).json({
            status: 200,
            totalTrips,
            totalPages,
            currentPage: page,
            pageSize,
            trips
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 500,
            error: 'An error occurred while processing your request'
        });
    }
};
export const getTripById = async (req: Request, res: Response) => {
  const { tripId } = req.params;

  try {
      const trip = await Trip.findOne({ where: { tripId } });

    if (!trip) {
        return res.status(404).json({
            status: 404,
            error: 'trip not found'
        });
    }

      return res.status(200).json({
              status: 200,
              data: trip
          });
  } catch (error) {
      return res.status(500).json({
          status: 500,
          error: 'An error occurred while processing your request'
      });
  }
};