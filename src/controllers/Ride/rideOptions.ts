import { Request, Response } from "express";
import { RideOption } from "../../models/rideOptions";

export const GetRideOptions = async (req: Request, res: Response) => {
    try {
        const rides = await RideOption.findAll();

        if (rides.length === 0) {
            return res.status(404).json({ error: 'No ride options available at the time' });
        }

        const rideOptions = rides.map(ride => ({
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

export const CreateRideOption = async (req: Request, res: Response) => {
    
    try {
        const { pricing, serviceType } = req.body;

        let capacity;
        switch (serviceType) {
            case 'Datride Vehicle':
                capacity = 4;
                break;
            case 'Datride Share':
                capacity = 1;
                break;
            case 'Datride Delivery':
                capacity = null;
                break;
            default:
                return res.status(400).json({ error: 'Invalid service type' });
        }

        // Check the current count of RideOption instances
        const count = await RideOption.count();

        // If there are already 3 instances, return an error response
        if (count >= 3) {
            return res.status(400).json({ error: 'Cannot create more than 3 ride options' });
        }

        // Create a new ride option record
        const rideOption = {
            capacity,
            pricing,
            serviceType
        };

        // Save the ride option to the database
        const newRideOption = await RideOption.create(rideOption);

        return res.status(200).json({ message: 'Ride option created successfully', rideOption: newRideOption });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'An error occurred while creating the ride option' });
    }
}

export const UpdateRideOption = async (req: Request, res: Response) => {
    try {
        // const adminId = decodeAdminIdFromToken(req)

        const {rideOptionid, pricing, serviceType } = req.body;

        let capacity;
        switch (serviceType) {
            case 'Datride Vehicle':
                capacity = 4;
                break;
            case 'Datride Share':
                capacity = 1;
                break;
            case 'Datride Delivery':
                capacity = null;
                break;
            default:
                return res.status(400).json({ error: 'Invalid service type' });
        }

        // Find the ride option with the provided id
        const rideOption = await RideOption.findByPk(rideOptionid);

        // If no ride option was found, return an error response
        if (!rideOption) {
            return res.status(404).json({ error: 'Ride option not found' });
        }

        // Update the ride option
        rideOption.pricing = pricing;
        rideOption.serviceType = serviceType;
        rideOption.capacity = capacity;

        // Save the updated ride option to the database
        const updatedRideOption = await rideOption.save();

        return res.status(200).json({ message: 'Ride option updated successfully', rideOption: updatedRideOption });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'An error occurred while updating the ride option' });
    }
}