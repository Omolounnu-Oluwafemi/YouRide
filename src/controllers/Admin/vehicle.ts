import { Request, Response } from "express";
import { Vehicle } from "../../models/vehicle";
import { v4 as uuidv4 } from "uuid";

export const GetVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await Vehicle.findAll();

        const vehicleCategory = vehicles.map(vehicle => ({
            country: vehicle.country,
            vehicleCategory: vehicle.vehicleCategory,
            baseFare: vehicle.baseFare,
            pricePerKMorMI: vehicle.pricePerKMorMI,
            status: vehicle.status,
            date: vehicle.createdAt
        }));
        res.json(vehicleCategory);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching Vehicles' });
    }
};

export const GetOneVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  try {
    const vehicle = await Vehicle.findOne({
      where: { vehicleId },
      attributes: [ 'country', 'baseFare', 'pricePerKMorMI', 'pricePerMIN', 'adminCommission', 'surgeStartTime', 'surgeEndTime', 'surgeType', 'status', 'carImage', 'documentImage', 'isDocVerified']
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.status(200).json(vehicle);
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred', error });
  }
};

export const CreateVehicle = async (req: Request, res: Response) => {
    try {
        const vehicleId = uuidv4();
        
        const { country, baseFare, pricePerKMorMI, pricePerMIN, adminCommission, status, vehicleCategory, vehicleName, carImage, documentImage, isSurge, surgeStartTime, surgeEndTime, surgeType, isDocVerified } = req.body;

        // Create a new vehicle record
        const vehicle = {
            vehicleId,
            driverId: null,
            country,
            baseFare,
            pricePerKMorMI,
            pricePerMIN,
            adminCommission,
            isSurge,
            surgeStartTime,
            surgeEndTime,
            surgeType,
            status,
            vehicleCategory,
            vehicleName,
            carImage,
            documentImage,
            isDocVerified
        };

        // Save the vehicle to the database
        const newVehicle = await Vehicle.create(vehicle);

      return res.status(200).json({
        message: 'Vehicle created successfully', vehicle: newVehicle
      });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'An error occurred while creating the vehicle' });
    }
}

export const EditVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
    const { country, baseFare, pricePerKMorMI, pricePerMIN, adminCommission, status, vehicleCategory, vehicleName, carImage, documentImage, isSurge, surgeStartTime, surgeEndTime, surgeType, isDocVerified } = req.body;

  try {
    const vehicle = await Vehicle.findOne({ where: { vehicleId } });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    vehicle.country = country;
    vehicle.baseFare = baseFare;
    vehicle.pricePerKMorMI = pricePerKMorMI;
    vehicle.pricePerMIN = pricePerMIN;
    vehicle.adminCommission = adminCommission;
    vehicle.isSurge = isSurge;
    vehicle.surgeStartTime = surgeStartTime;
    vehicle.surgeEndTime = surgeEndTime;
    vehicle.surgeType = surgeType;
    vehicle.status = status;
    vehicle.vehicleCategory = vehicleCategory;
    vehicle.vehicleName = vehicleName;
    vehicle.carImage = carImage;
    vehicle.documentImage = documentImage;
    vehicle.isDocVerified = isDocVerified;

    await vehicle.save();

    return res.status(200).json({ message: 'Vehicle updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred', error });
  }
};