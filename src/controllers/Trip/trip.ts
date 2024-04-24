import { Sequelize } from 'sequelize';
import { Request, Response } from "express";
import { Trip } from "../../models/trip";
import { User } from "../../models/usersModel";
import { Driver } from "../../models/drivers";
import { Vehicle } from "../../models/vehicle";
import { v4 as uuidv4 } from "uuid";
import { decodeUserIdFromToken } from "../../utils/token";
import { Voucher } from "../../models/voucher";
import { tripAmountschema } from '../../utils/validate'

interface TripCreation {
    tripId: string;
    userId: string;
    driverId: string | null;
    userName: string;
    vehicleId: string | null;
    paymentMethod: string;
    country: string;
    tripAmount: number;
    totalDistance: number;
    driverName: string | null;
    pickupLocation: string;
    destination: string;
    pickupLatitude: number;
    pickupLongitude: number;
    destinationLatitude: number;
    destinationLongitude: number;
    pickupTime: Date | null;
    dropoffTime: Date | null;
    status: 'current' | 'scheduled' | 'completed' | 'cancelled';
}

async function findClosestDriver(latitude: number, longitude: number, vehicleName: string) {
    const userLocation = Sequelize.literal(`ST_MakePoint(${longitude}, ${latitude})`);
    const driverLocation = Sequelize.literal(`ST_MakePoint(longitude, latitude)`);
    const distance = Sequelize.fn('ST_Distance', driverLocation, userLocation);

    // Find the vehicle with the given name
    const vehicle = await Vehicle.findOne({ where: { vehicleName } });

    if (!vehicle) {
        throw new Error('Vehicle not found');
    }

    // Find the closest driver who is driving the specified vehicle and is available
    const driverData = await Driver.findOne({
        where: {
            isAvailable: true,
        },
          include: [{
            model: Vehicle,
            where: {
                name: vehicleName
            }
        }],
        order: Sequelize.literal(`${distance} ASC`),
        limit: 1
    });

    return driverData;
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
    const userId = decodeUserIdFromToken(req)
    
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

        // Create a new Trip record
        const trip: TripCreation = {
            tripId,
            userId: userData.userId, 
            driverId: null, 
            userName: userData.firstName + ' ' + userData.lastName,
            vehicleId: null,
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
        };

        const newTrip = await userData.createTrip(trip);

        // Find the closest driver
        const driverData = await findClosestDriver(pickupLocation.latitude, pickupLocation.longitude, vehicleName);

        if (!driverData) {
            return res.status(404).json({ error: "No available drivers found" });
        }

        res.status(201).json({
            Success: "Trip order created successfully",
            data: newTrip
        });
    } catch (error: any) {
        res.status(500).json({
            error: "An error occurred while processing your request",
            message: error.message
        });
    };
}
