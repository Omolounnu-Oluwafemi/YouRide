import { Request, Response } from 'express';
import { Driver } from '../../models/drivers';
import  cloudinary  from '../../utils/cloudinary'; 


export const getVehicleDetails = async (req: Request, res: Response) => {
  const driverId = req.params.driverId;

  try {
    const driver = await Driver.findOne({ where: { driverId } });

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const vehicleDetails = {
      category: driver.category,
      vehicleYear: driver.vehicleYear,
      vehicleManufacturer: driver.vehicleManufacturer,
      vehicleColor: driver.vehicleColor,
      licensePlate: driver.licensePlate,
      vehicleNumber: driver.vehicleNumber,
      driverLicense: driver.driverLicense,
      vehicleLogBook: driver.vehicleLogBook,
      privateHireLicenseBadge: driver.privateHireLicenseBadge,
      insuranceCertificate: driver.insuranceCertificate,
      motTestCertificate: driver.motTestCertificate,
    };

    return res.status(200).json(vehicleDetails);
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while retrieving vehicle details' });
  }
};
export const updateVehicleDetails = async (req: Request, res: Response) => {
  const driverId = req.params.driverId;
        const { category, vehicleYear, vehicleManufacturer, vehicleColor, licensePlate, vehicleNumber } = req.body;
    
        const vehicleDetails = { category, vehicleYear, vehicleManufacturer, vehicleColor, licensePlate, vehicleNumber };

    try {
        const driver = await Driver.findOne({ where: { driverId } });

        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }

        await Driver.update(vehicleDetails, { where: { driverId } });

        return res.status(200).json({ message: 'Vehicle details updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while updating vehicle details' });
    }
};


export const updateDocuments = async (req: Request, res: Response) => {
  const driverId = req.params.driverId;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    const driver = await Driver.findOne({ where: { driverId } });

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const updatedDocuments = {};

    for (const [key, fileArray] of Object.entries(files)) {
      if (fileArray.length > 0) {
        const file = fileArray[0];
        const result = await uploadToCloudinary(file);
        updatedDocuments[key] = { name: file.originalname, url: result.secure_url };
      }
    }

    await Driver.update(updatedDocuments, { where: { driverId } });

    return res.status(200).json({ message: 'Documents updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while updating documents' });
  }
};