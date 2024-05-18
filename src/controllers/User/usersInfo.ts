import { Request, Response } from 'express';
import { User } from '../../models/usersModel';
import { Op } from 'sequelize'; 
import { Trip } from '../../models/trip';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const email = req.query.email || '';
        const phoneNumber = req.query.phoneNumber || '';
        const search = req.query.search || '';
        let date = req.query.date ? new Date(req.query.date as string) : null;

        const whereClause: {
            email?: { [Op.like]: string },
            phoneNumber?: { [Op.like]: string },
            createdAt?: { [Op.gte]: Date } | { [Op.between]: Date[] },
              [Op.or]?: {
                firstName?: { [Op.like]: string },
                lastName?: { [Op.like]: string },
                email?: { [Op.like]: string },
                phoneNumber?: {[Op.like]: string },
            }
        } = {
            email: {
                [Op.like]: `%${email}%`
            },
            phoneNumber: {
                [Op.like]: `%${phoneNumber}%`
            }
        };

         if (search) {
            whereClause[Op.or] = {
                firstName: { [Op.like]: `%${search}%` },
                lastName: { [Op.like]: `%${search}%` },
                email: { [Op.like]: `%${search}%` },
                phoneNumber: { [Op.like]: `%${search}%` }
            };
        }

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

         if (totalUsers === 0) {
             return res.status(404).json({
                 status: 404,
                 error: 'No users found'
             });
         }
        
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
            status: 200,
            totalUsers,
            totalPages,
            currentPage: page,
            pageSize,
            users
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            error: 'An error occurred while processing your request'
        });
    }
}
export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ where: { userId } });

    if (!user) {
        return res.status(404).json({
            status: 404,
            error: 'User not found'
        });
    }

    await User.destroy({ where: { userId } });

      return res.status(200).json({
          status: 200,
          message: 'User deleted successfully'
      });
  } catch (error) {
      return res.status(500).json({
          status: 500,
          error: 'An error occurred while processing your request'
      });
  }
};
export const getUserTrips = async (req: Request, res: Response) => {
    const { userId } = req.query;

    try {
        const trips = await Trip.findAll({ where: { userId: userId as string } });

        if (!trips) {
            return res.status(404).json({
                status: 404,
                error: "No trips found for this user"
            });
        }

        res.status(200).json({
            status: 200,
            data: trips
        });
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            status: 500,
            error: "An error occurred while processing your request",
            message: error.message
        });
    };
}
// export const updateUserProfile = async (req: Request, res: Response) => {
//     const userId = req.params.userId;
//     const {
//         email,
//         country,
//         firstName,
//         lastName,
//         profileImage,
//         homeAddress,
//     } = req.body;

//     const profilePictureFile = req.file;
    
//     let profilePictureUrl;
//     try {
//       if (profilePictureFile) {
//         profilePictureUrl = await uploadToCloudinary(profilePictureFile);
//       } else {
//         throw new Error('Profile picture file is undefined');
//       }
//     } catch (error) {
//       return res.status(500).json({
//         status: 500,
//         error: 'Failed to upload image'
//       });
//     }

//     try {
//         const [updated] = await User.update({
//             email,
//             country,
//             firstName,
//             lastName,
//             profileImage,
//             homeAddress,
//         }, {
//             where: { userId: userId }
//         });

//         if (!updated) {
//             throw new Error('Unable to update user');
//         }

//         res.status(200).json({
//             status: 200,
//             message: 'User information updated successfully.'
//         });
//     } catch (error: any) {
//         console.log(error)
//         res.status(500).json({
//             status: 500,
//             error: "An error occurred while processing your request",
//             message: error.message
//         });
//     };
// }
