import { Request, Response } from 'express';
import { User } from '../../models/usersModel';
import { Op } from 'sequelize'; 

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const email = req.query.email || '';
        const phoneNumber = req.query.phoneNumber || '';
        let date = req.query.date ? new Date(req.query.date as string) : null;

        const whereClause: {
            email?: { [Op.like]: string },
            phoneNumber?: { [Op.like]: string },
            createdAt?: { [Op.gte]: Date } | { [Op.between]: Date[] }
        } = {
            email: {
                [Op.like]: `%${email}%`
            },
            phoneNumber: {
                [Op.like]: `%${phoneNumber}%`
            }
        };

        if (date) {
            let startOfDay = new Date(date.setHours(0,0,0,0));
            let endOfDay = new Date(date.setHours(23,59,59,999));
             whereClause.createdAt = {
                [Op.between]: [startOfDay, endOfDay]
            }
        }

        const totalUsers = await User.count({
            where: whereClause
        });
        const totalPages = Math.ceil(totalUsers / pageSize);

        const users = await User.findAll({
            where: whereClause,
            order: [
                ['createdAt', 'DESC']
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize
        });

        return res.status(200).json({
            totalUsers,
            totalPages,
            currentPage: page,
            pageSize,
            users
        });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
}
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ where: { userId: id } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.destroy({ where: { userId: id } });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};
