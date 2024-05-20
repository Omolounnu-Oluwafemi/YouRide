import { Request, Response } from 'express';
import { Driver } from '../../models/drivers';
import { Country } from '../../models/countries';
import { Op } from 'sequelize'; 
import cloudinary from '../../utils/cloudinary';

const uploadToCloudinary = async (file: Express.Multer.File) => {
  const result = await cloudinary.uploader.upload(file.path);
  return result.secure_url;
};

export const getAllDrivers = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const email = req.query.email || '';
        const phoneNumber = req.query.phoneNumber || '';
        const driverLicense = req.query.driverLicense || '';
        const search = req.query.search || '';
        let date = req.query.date ? new Date(req.query.date as string) : null;

        const whereClause: {
            email?: { [Op.like]: string },
            phoneNumber?: { [Op.like]: string },
            driverLicense?: { [Op.like]: string },
            createdAt?: { [Op.gte]: Date } | { [Op.between]: Date[] },
            [Op.or]?: {
                firstName?: { [Op.like]: string },
                lastName?: { [Op.like]: string },
                email?: { [Op.like]: string },
                phoneNumber?: {[Op.like]: string },
                driverLicense?: { [Op.like]: string }
            }
        } = {
            email: {
                [Op.like]: `%${email}%`
            },
            phoneNumber: {
                [Op.like]: `%${phoneNumber}%`
            },
            driverLicense: {
                [Op.like]: `%${driverLicense}%`
            }
        };

        if (search) {
            whereClause[Op.or] = {
                firstName: { [Op.like]: `%${search}%` },
                lastName: { [Op.like]: `%${search}%` },
                email: { [Op.like]: `%${search}%` },
                phoneNumber: { [Op.like]: `%${search}%` },
                driverLicense: { [Op.like]: `%${search}%` }
            };
        }

        if (date) {
            let startOfDay = new Date(date.setHours(0, 0, 0, 0));
            let endOfDay = new Date(date.setHours(23, 59, 59, 999));
            whereClause.createdAt = {
                [Op.between]: [startOfDay, endOfDay]
            }
        }

        const totalDrivers = await Driver.count({
            where: whereClause
        });

        if (totalDrivers === 0) {
            return res.status(404).json({ error: 'No drivers found' });
        }
        const totalPages = Math.ceil(totalDrivers / pageSize);

        const drivers = await Driver.findAll({
            where: whereClause,
            order: [
                ['createdAt', 'DESC']
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize
        });

        return res.status(200).json({
            totalDrivers,
            totalPages,
            currentPage: page,
            pageSize,
            drivers
        });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};
export const getAvailableDrivers = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const search = req.query.search || '';
        let date = req.query.date ? new Date(req.query.date as string) : null;

        const whereClause: {
            isAvailable: boolean,
            createdAt?: { [Op.between]: Date[] },
            [Op.or]?: {
                firstName?: { [Op.like]: string },
                lastName?: { [Op.like]: string },
                email?: { [Op.like]: string },
                phoneNumber?: {[Op.like]: string },
                driverLicense?: { [Op.like]: string }
            }
        } = {
            isAvailable: true
        };

        if (search) {
            whereClause[Op.or] = {
                firstName: { [Op.like]: `%${search}%` },
                lastName: { [Op.like]: `%${search}%` },
                email: { [Op.like]: `%${search}%` },
                phoneNumber: { [Op.like]: `%${search}%` },
                driverLicense: { [Op.like]: `%${search}%` }
            };
        }

        if (date) {
            let startOfDay = new Date(date.setHours(0, 0, 0, 0));
            let endOfDay = new Date(date.setHours(23, 59, 59, 999));
            whereClause.createdAt = {
                [Op.between]: [startOfDay, endOfDay]
            }
        }

        const totalDrivers = await Driver.count({
            where: whereClause
        });

        if (totalDrivers === 0) {
            return res.status(404).json({ error: 'No available drivers found' });
        }

        const totalPages = Math.ceil(totalDrivers / pageSize);

        const drivers = await Driver.findAll({
            where: whereClause,
            order: [
                ['createdAt', 'DESC']
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize
        });

        return res.status(200).json({
            totalDrivers,
            totalPages,
            currentPage: page,
            pageSize,
            drivers
        });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
}
export const getAllDriversLocations = async (req: Request, res: Response) => {
      try {
        const drivers = await Driver.findAll({
            attributes: ['driverId', 'latitude', 'longitude']
        });

        return res.status(200).json(drivers);
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
}
export const deleteDriver = async (req: Request, res: Response) => {
  const { driverId } = req.params;

  try {
    const driver = await Driver.findOne({ where: { driverId } });

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    await Driver.destroy({ where: { driverId } });

    return res.status(200).json({ message: 'Driver deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};
export const updateDriverAdmin = async (req: Request, res: Response) => {
    const driverId = req.params.driverId;

    const {
        country,
        firstName,
        lastName,
        gender,
        category,
        vehicleYear,
        vehicleManufacturer,
        vehicleColor,
        licensePlate,
        status,
        dateOfBirth,
        verificationCode,
        residenceAddress,
    } = req.body;

    const { profileImage, documentUpload } = req.files as { [fieldname: string]: Express.Multer.File[] };

    try {
            let profileImageUrl, documentUploadUrl;
        if (profileImage && profileImage[0]) {
        profileImageUrl = await uploadToCloudinary(profileImage[0]);
        }
        if (documentUpload && documentUpload[0]) {
        documentUploadUrl = await uploadToCloudinary(documentUpload[0]);
        }
        
        const driver = await Driver.findOne({ where: { driverId: driverId } });
        if (!driver) {
            return res.status(404).json({
                status: 404,
                error: "Driver not found",
                message: "Driver not found"
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

        const [updated] = await Driver.update({
            country,
            firstName,
            lastName,
            gender,
            category,
            vehicleYear,
            vehicleManufacturer,
            vehicleColor,
            licensePlate,
            status,
            dateOfBirth,
            verificationCode,
            residenceAddress,
            profileImage: profileImageUrl,
            documentUpload: documentUploadUrl
        }, {
            where: { driverId: driverId }
        });

        if (!updated) {
            throw new Error('Unable to update driver');
        }

        res.status(200).json({
            status: 200,
            message: 'Driver information updated successfully.'
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