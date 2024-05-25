import { Request, Response } from "express";
import { VehicleCategory } from "../../models/vehicle";
import { Country } from "../../models/countries";
import cloudinary from '../../utils/cloudinary';
import { v4 as uuidv4 } from "uuid";

export const GetVehicleCategories = async (req: Request, res: Response) => {
    try {
      const category = await VehicleCategory.findAll({
        include: [{
          model: Country,
          as: 'Countries',
        }]
      });

        if (category.length === 0) {
            return res.status(404).json({
                status: 404,
                error: 'No vehicle categories found'
            });
        }

      res.status(200).json({
        status: 200,
        data: category
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: 500,
        error: 'An error occurred while fetching Vehicles'
      });
    }
};
export const GetOneVehicleCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  try {
    const category = await VehicleCategory.findOne({
      where: { categoryId },
        include: [{
        model: Country,
        as: 'Countries',
        // attributes: ['name'], 
        through: { attributes: [] } 
      }]
    });

    if (!category) {
      return res.status(404).json({
        status: 404,
        message: 'Vehicle Category not found'
      });
    }

    return res.status(200).json({
      status: 200,
      data: category
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      message: 'An error occurred', error
    });
  }
};
export const CreateVehicleCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = uuidv4();
        
        const { country, baseFare, pricePerKMorMI, pricePerMIN, adminCommission, status, categoryName, vehicleName, isSurge, surgeStartTime, surgeEndTime, surgeType, isDocVerified } = req.body;

        // Check if the country exists in the database
        const countryRecord = await Country.findOne({ where: { name: country } });
        if (!countryRecord) {
          return res.status(400).json({
            status: 400,
            error: 'The specified country does not exist'
          });
        }
      
        // Check if a VehicleCategory with the same vehicleName already exists for the specified country
          const existingVehicleCategory = await VehicleCategory.findOne({ 
            where: { vehicleName }, 
            include: [{
                model: Country,
                where: { name: country },
                through: { attributes: [] },
            }]
        });
        if (existingVehicleCategory) {
            return res.status(400).json({
                status: 400,
                error: 'A Vehicle Category with the same vehicle name already exists for the specified country'
            });
        }

        if (!req.files) {
          return res.status(400).json({
            status: 400,
            error: 'No files were uploaded'
          });
        }

        // Upload carImage to Cloudinary
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const carImageResult = await cloudinary.uploader.upload(files.carImage[0].path);
        const carImage = carImageResult.secure_url;

        // Upload documentImage to Cloudinary
        const documentImageResult = await cloudinary.uploader.upload(files.documentImage[0].path);
        const documentImage = documentImageResult.secure_url;

        // Create a new vehicle record
        const category = {
            categoryId,
            driverId: null,
            countryId: countryRecord.countryId,
            baseFare,
            pricePerKMorMI,
            pricePerMIN,
            adminCommission,
            isSurge,
            surgeStartTime,
            surgeEndTime,
            surgeType,
            status,
            categoryName,
            vehicleName,
            carImage,
            documentImage,
            isDocVerified
        };

        // Save the vehicle to the database
      const newVehicleCategory = await VehicleCategory.create(category);
      
        // Associate the new vehicle with the country
        await newVehicleCategory.addCountry(countryRecord.countryId);
      
        return res.status(200).json({
        status: 200,
        message: 'Vehicle Category created successfully',
        category: newVehicleCategory
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 500,
        error: 'An error occurred while creating the vehicle'
      });
    }
}
export const EditVehicleCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { baseFare, pricePerKMorMI, pricePerMIN, adminCommission, status, categoryName, isSurge, surgeStartTime, surgeEndTime, surgeType, isDocVerified } = req.body;

  try {
    const category = await VehicleCategory.findOne({ where: { categoryId } });

    if (!category) {
      return res.status(404).json({
        status: 400,
        message: 'Vehicle Category not found'
      });
    }

    if (!req.files) {
      return res.status(400).json({
        status: 400,
        error: 'No files were uploaded'
      });
    }

    // Upload carImage to Cloudinary
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const carImageResult = await cloudinary.uploader.upload(files.carImage[0].path);
    const carImage = carImageResult.secure_url;

    // Upload documentImage to Cloudinary
    const documentImageResult = await cloudinary.uploader.upload(files.documentImage[0].path);
    const documentImage = documentImageResult.secure_url;

    category.baseFare = baseFare;
    category.pricePerKMorMI = pricePerKMorMI;
    category.pricePerMIN = pricePerMIN;
    category.adminCommission = adminCommission;
    category.isSurge = isSurge;
    category.surgeStartTime = surgeStartTime;
    category.surgeEndTime = surgeEndTime;
    category.surgeType = surgeType;
    category.status = status;
    category.categoryName= categoryName;
    category.carImage = carImage;
    category.documentImage = documentImage;
    category.isDocVerified = isDocVerified;

    await category.save();

    return res.status(200).json({
      status: 200,
      message: 'Vehicle Category updated successfully'
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 500,
      message: 'An error occurred',
      error
    });
  }
};
export const DeleteVehicleCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  try {
    const category = await VehicleCategory.findOne({ where: { categoryId } });

    if (!category) {
      return res.status(404).json({
        status: 404,
        message: 'Vehicle Category not found'
      });
    }

    await category.destroy();

    return res.status(200).json({
      status: 200,
      message: 'Vehicle Category deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 500,
      message: 'An error occurred',
      error
    });
  }
};