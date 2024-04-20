import { Request, Response, NextFunction } from "express";
import { Ride } from "../../models/ride";
import { v4 as uuidv4 } from "uuid";
import { decodeUserIdFromToken } from "../../utils/token";
import {validateBookRide} from '../../utils/middleware'

interface RideCreation {
  rideId: string;
  userId: string;
  driverId: string | null;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: Date | null;
  dropoffTime: Date | null;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
}

export const BookRide = async (req: Request, res: Response) => {
    try {
        const rideId = uuidv4();
        const userId = decodeUserIdFromToken(req)

        const { pickupLocation, dropoffLocation } = req.body;

        // Create a new ride record
        const ride: RideCreation = {
            rideId,
            userId,
            driverId: null,
            pickupLocation,
            dropoffLocation,
            pickupTime: null,
            dropoffTime: null,
            status: 'pending',
        };
         // Save the ride to the database
        const newRide = await Ride.create(ride);
        return res.status(200).json({ message: 'Ride booked successfully', ride: newRide });
        
    } catch (error) {
        // console.log(error)
        return res.status(500).json({ error: 'An error occurred while booking the ride' }); 
    }
}

