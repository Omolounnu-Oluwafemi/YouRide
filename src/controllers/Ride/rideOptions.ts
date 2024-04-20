import { Request, Response } from "express";
import { RideOption } from "../../models/rideOptions";

export const GetRideOtions = async (req: Request, res: Response) => {
    try {
        const rides = await RideOption.findAll();

        const rideOptions = rides.map(ride => ({
            vehicleType: ride.vehicleType,
            capacity: ride.capacity,
            pricing: ride.pricing,
            serviceType: ride.serviceType
        }));
        res.json(rideOptions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching ride options' });
    }
};