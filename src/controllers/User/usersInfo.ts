import { Request, Response } from 'express';
import { User } from '../../models/usersModel';
import { Country } from '../../models/countries';
import { Op } from 'sequelize'; 
import { Trip } from '../../models/trip';
import cloudinary from '../../utils/cloudinary';

const uploadToCloudinary = async (file: Express.Multer.File) => {
  const result = await cloudinary.uploader.upload(file.path);
  return result.secure_url;
};
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
    const userId = req.query.userId;

    try {
        const trips = await Trip.findAll({ where: { userId: userId as string } });

        if (trips.length === 0) {
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
export const updateUserProfile = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    
    const {
        country,
        firstName,
        lastName,
        homeAddress,
        dateOfBirth,
        status
    } = req.body;

    const profileImageFile = req.file;

     let profileImageUrl;
    try {
      if (profileImageFile) {
        profileImageUrl = await uploadToCloudinary(profileImageFile);
      } else {
        throw new Error('Profile picture file is undefined');
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Failed to upload image'
      });
    }

    try {
        const user = await User.findOne({ where: { userId: userId } });
        if (!user) {
            return res.status(404).json({
                status: 404,
                error: "User not found",
                message: "No user found with the provided userId"
            });
        }

        const countryExists = await Country.findOne({ where: { name: country } });
        if (!countryExists) {
            return res.status(400).json({
                status: 400,
                error: "Invalid country",
                message: "We do not operate in this region yet."
            });
        }

        const [updated] = await User.update({
            country,
            firstName,
            lastName,
            profileImage: profileImageUrl,
            homeAddress,
            dateOfBirth,
            status
        }, {
            where: { userId: userId }
        });

        if (!updated) {
            throw new Error('Unable to update user');
        }

        res.status(200).json({
            status: 200,
            message: 'User information updated successfully.'
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
