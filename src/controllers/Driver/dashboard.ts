import { Request, Response } from 'express';
import { Driver } from '../../models/drivers';
import { decodeDriverIdFromToken } from '../../utils/token';
import { driverSocketMap } from '../../config/socket';
import { Trip } from '../../models/trip'; 

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
      driverLicense: driver.driverLicense,
      vehicleLogBook: driver.vehicleLogBook,
      privateHireLicenseBadge: driver.privateHireLicenseBadge,
      insuranceCertificate: driver.insuranceCertificate,
      motTestCertificate: driver.motTestCertificate,
    };

    return res.status(200).json(vehicleDetails);
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: 'An error occurred while retrieving vehicle details'
    });
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
  const { latitude, longitude, driverId, socketId } = req.body; 

  try {
    const driver = await Driver.findOne({ where: { driverId } });

    if (!driver) {
      return res.status(404).json({
        status: 404,
        error: 'Driver not found'
      });
    }

    const isAvailable = !driver.isAvailable;
    await Driver.update({ 
      isAvailable: isAvailable, 
      latitude,
      longitude 
    }, { where: { driverId } });

    // Update the driverSocketMap based on the driver's availability
    if (isAvailable) {
      driverSocketMap.set(driverId, socketId);
    } else {
      driverSocketMap.delete(driverId);
    }

    return res.status(200).json({
      status: 200,
      message: 'Availability and location updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'An error occurred while updating availability and location'
    });
  }
};
export const driverRating = async (req: Request, res: Response) => {
  try {
    const { driverId, rating } = req.body;

    // Find the user by userId
    const driver = await Driver.findOne({ where: { driverId: driverId } });

    if (!driver) {
      return res.status(404).json({
        status: 404,
        error: 'Driver not found'
      });
    }
    // Calculate the new average rating
    const newAverageRating = (driver.driverRating + rating) / (driver.numberOfRatings + 1);

    // Update the user's rating and number of ratings
    driver.driverRating = newAverageRating;
    driver.numberOfRatings += 1;
    await driver.save();

    // Return a response
    res.status(200).json({
      status: 200,
      message: 'Driver rated successfully',
      newAverageRating
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      status: 500,
      error: 'Error rating driver' 
    });
  }
};
export const getDriverRideHistory = async (req: Request, res: Response) => {
  const driverId = req.query.driverId as string;

    try {
      const driver = await Driver.findByPk(driverId);
      
        if (!driver) {
          return res.status(404).json({
            status: 404,
            message: 'Driver not found'
          });
        }

        const trips = await Trip.findAll({ where: { driverId: driverId as string } });
      
          if (trips.length === 0) {
            return res.status(404).json({
                status: 404,
                error: "No trips found for this Driver"
            });
        }
      
        const totalTrips = trips.length;
        const rideHistory = trips;

      return res.status(200).json({
        status: 200,
        rideHistory,
        totalTrips
      });
    } catch (error) {
      return res.status(500).json({
        message: 'An error occurred while fetching the ride history'
      });
    }
};
