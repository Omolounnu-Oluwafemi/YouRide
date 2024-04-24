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
    pickupTime: Date | null;
    dropoffTime: Date | null;
    status: 'current' | 'scheduled' | 'completed' | 'cancelled';
}

export const calculateTripAmount = async (req: Request, res: Response) => {
    try {
        const { vehicleName, totalDistance, time, voucher, country } = req.body;

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
        const baseTripAmount = vehicle.baseFare + vehicle.pricePerMIN * time + vehicle.pricePerKMorMI * totalDistance + vehicle.adminCommission;

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
    
    const { country, pickupLocation, destination, vehicleName, paymentMethod, tripAmount, totalDistance } = req.body;

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
            pickupTime: null,
            dropoffTime: null,
            status: 'scheduled',
        };

        const newTrip = await userData.createTrip(trip);

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
