import { Request, Response } from 'express';
import { Driver } from '../../models/drivers';
import  cloudinary  from '../../utils/cloudinary'; 
import { decodeDriverIdFromToken } from '../../utils/token';

export const getVehicleDetails = async (req: Request, res: Response) => {

  try {
    const driverId = decodeDriverIdFromToken(req)

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
    console.error(error)
    return res.status(500).json({ error: 'An error occurred while retrieving vehicle details' });
  }
};
export const updateVehicleDetails = async (req: Request, res: Response) => {
  
  const { category, vehicleYear, vehicleManufacturer, vehicleColor, licensePlate, vehicleNumber } = req.body;
    
  const vehicleDetails = { category, vehicleYear, vehicleManufacturer, vehicleColor, licensePlate, vehicleNumber };

  try {
    const driverId = decodeDriverIdFromToken(req)
    
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

export const updateAvailability = async (req: Request, res: Response) => {
  const driverId = decodeDriverIdFromToken(req);
  const { latitude, longitude } = req.body; 
  
  try {
    const driver = await Driver.findOne({ where: { driverId } });

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    await Driver.update({ 
      isAvailable: !driver.isAvailable, 
      latitude,
      longitude 
    }, { where: { driverId } });

    return res.status(200).json({ message: 'Availability and location updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while updating availability and location' });
  }
};
