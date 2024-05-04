import * as geolib from 'geolib';
import { Request, Response } from "express";
import { Trip } from "../../models/trip";
import { User } from "../../models/usersModel";
import { Driver } from "../../models/drivers";
import { Vehicle } from "../../models/vehicle";
import { v4 as uuidv4 } from "uuid";
import { Voucher } from "../../models/voucher";
import { tripAmountschema } from '../../utils/validate'
import { io, driverSocketMap } from '../../config/socket';


async function findClosestDriver(pickupLatitude: number, pickupLongitude: number, vehicleName: string) {
    // Fetch all available drivers who are driving the requested vehicle type
     const vehicle = await Vehicle.findOne({ where: { vehicleName: vehicleName } });

    if (!vehicle) {
        return null;
    }

    // Fetch all available drivers for this vehicle
    const drivers = await Driver.findAll({
        where: { vehicleId: vehicle.vehicleId, isAvailable: true },
    });

    if (drivers.length === 0) {
        return null;
    }

    // Calculate the distance from each driver to the pickup location
    const distances = drivers.map(driver => ({
        driver,
        distance: geolib.getDistance(
            { latitude: driver.latitude, longitude: driver.longitude },
            { latitude: pickupLatitude, longitude: pickupLongitude }
        ),
    }));

    // Sort the drivers by distance and return the closest one
    distances.sort((a, b) => a.distance - b.distance);
    return distances[0].driver;
}
export const calculateTripAmount = async (req: Request, res: Response) => {
    try {
        const { vehicleName, totalDistance, estimatedtime, voucher, country } = req.body;

        const { error } = tripAmountschema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: 'Invalid input', error: error.details[0].message });
        }
        // Get the vehicle details
        const vehicle = await Vehicle.findOne({ where: { vehicleName, country } });

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Check if voucher is valid and active
        let voucherData;
        let discount = 0;
        if (voucher) {
            voucherData = await Voucher.findOne({ where: { couponCode: voucher } });
            if (!voucherData || voucherData.status !== 'active') {
                return res.status(400).json({ error: "Invalid or inactive voucher" });
            }
            // Apply the discount
            discount = voucherData.discount;
        }

        // Calculate the trip amount
        const baseTripAmount = vehicle.baseFare + vehicle.pricePerMIN * estimatedtime + vehicle.pricePerKMorMI * totalDistance + vehicle.adminCommission;

        // Apply the discount to the base trip amount
        const discountedTripAmount = baseTripAmount - (baseTripAmount * discount / 100);

        // Calculate the trip amounts for all vehicle types
        const tripAmounts = {
            'Datride Vehicle': discountedTripAmount,
            'Datride Share': discountedTripAmount / 4,
            'Datride Delivery': discountedTripAmount,
        };
        
          if (voucherData) {
            // Decrease the usageLimit of the voucher by 1
            voucherData.usageLimit -= 1;
            // If usageLimit is now 0, set status to 'inactive'
            if (voucherData.usageLimit === 0) {
                voucherData.status = 'inactive';
            }
            // Save the updated voucher
            await voucherData.save();
        }
        // Send the response
        res.status(200).json({
            message: 'Trip amounts calculated successfully',
            tripAmounts
        });
    } catch (error: any) {
        res.status(500).json({ message: 'An error occurred while calculating the trip amounts', error: error.message });
    }
};
export const TripRequest = async (req: Request, res: Response) => {
    const tripId = uuidv4();
    const userId = req.params.userId;
    
    const { country, pickupLocation, destination, vehicleName, paymentMethod, tripAmount, totalDistance, pickupLatitude, pickupLongitude, destinationLatitude, destinationLongitude } = req.body;

    try {
        const vehicleData = await Vehicle.findOne({ where: { vehicleName: vehicleName } });
        if (!vehicleData) {
            return res.status(400).json({ error: "Invalid Trip option" });
        }

        // Fetch user details
        const userData = await User.findOne({ where: { userId: userId } });

        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!pickupLocation || pickupLatitude === undefined || pickupLongitude === undefined) {
            throw new Error('Invalid pickup location');
        }

        // Find the closest driver
        const driverData = await findClosestDriver(pickupLatitude, pickupLongitude, vehicleName);

        if (!driverData) {
            return res.status(404).json({ error: "No available drivers found" });
        }

        // Create a new Trip record
        const newTrip = await Trip.create({
            tripId,
            userId: userData.userId, 
            driverId: null, 
            userName: userData.firstName + ' ' + userData.lastName,
            vehicleId: null,
            vehicleName,
            paymentMethod,
            totalDistance,
            tripAmount,
            country,
            driverName: null,
            pickupLocation,
            destination,
            pickupLatitude,
            pickupLongitude,
            destinationLatitude,
            destinationLongitude,
            pickupTime: null,
            dropoffTime: null,
            status: 'scheduled',
        });

        // Emit the new trip to the closest driver
        const driverSocketId = driverSocketMap.get(driverData.driverId);
        if (driverSocketId) {
            io.to(driverSocketId).emit('newTrip', newTrip);
        }

        res.status(201).json({
            Success: "Trip order created successfully",
            data: newTrip
        });
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            error: "An error occurred while processing your request",
            message: error.message
        });
    };
}
export const acceptTrip = async (req: Request, res: Response) => {
    const { tripId } = req.body;
    const driverId = req.params.driverId;

    try {
        const driver = await Driver.findOne({ where: { driverId: driverId } });

        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        const driverName = driver.firstName + " " + driver.lastName;

        // Find the trip with the given id
        const trip = await Trip.findOne({ where: { tripId: tripId } });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        // Check if the trip is already accepted
        if (trip.driverId) {
            return res.status(400).json({
                error: 'Trip is already accepted by another driver'
            });
        }

        // Update the trip with the driverId and change the status to 'accepted'
        const updatedTrip = await trip.update({
            driverId,
            driverName,
        });

        return res.status(200).json({
            message: 'Trip accepted successfully',
            trip: updatedTrip
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'An error occurred while accepting the trip'
        });
    }
}
export const skipTrip = async (req: Request, res: Response) => {
    try {
        const { tripId } = req.params;

        // Find the trip with the given ID
        const trip = await Trip.findOne({ where: { tripId: tripId } });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        // Find the next closest driver
        const nextDriver = await findClosestDriver(trip.pickupLatitude, trip.pickupLongitude, trip.vehicleName);

        if (!nextDriver) {
            return res.status(404).json({ error: 'No available drivers found' });
        }

        // Emit the trip to the next driver
        const driverSocketId = driverSocketMap.get(nextDriver.driverId);
        if (driverSocketId) {
            io.to(driverSocketId).emit('newTrip', trip);
        }

        return res.status(200).json({
            message: 'Trip skipped successfully',
            trip
        });
    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while processing your request'
        });
    }
}
export const startTrip = async (req: Request, res: Response) => {
    try {
        const { tripId } = req.params;
        const { driverId } = req.body;

        // Find the trip with the given ID
        const trip = await Trip.findOne({ where: { tripId: tripId } });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        // Check if the trip is assigned to the current driver
        if (trip.driverId !== driverId) {
            return res.status(403).json({ error: 'This trip is not assigned to you' });
        }

        // Update the status and pickup time of the trip
        trip.status = 'current';
        trip.pickupTime = new Date();
        await trip.save();

        return res.status(200).json({
            message: 'Trip started successfully'
        });
    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while processing your request'
        });
    }
}
export const cancelTrip = async (req: Request, res: Response) => {
    try {
        const { tripId } = req.params;

        // Find the trip with the given ID
        const trip = await Trip.findOne({ where: { tripId: tripId } });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        // Update the status of the trip
        trip.status = 'cancelled';
        await trip.save();

        return res.status(200).json({
            message: 'Trip cancelled successfully'
        });
    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while processing your request'
        });
    }
}
export const completeTrip = async (req: Request, res: Response) => {
    try {
        const { tripId } = req.params;

        // Find the trip with the given ID
        const trip = await Trip.findOne({ where: { tripId: tripId } });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        // Update the status of the trip
        trip.status = 'completed';
        trip.dropoffTime = new Date(); 
        await trip.save();

        return res.status(200).json({
            message: 'Trip completed successfully'
        });
    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while processing your request'
        });
    }
}