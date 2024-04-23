import { Request, Response } from "express";
import { Trip } from "../../models/trip";
import { User } from "../../models/usersModel";
import { Driver } from "../../models/drivers";
import { Vehicle } from "../../models/vehicle";
import { v4 as uuidv4 } from "uuid";
import { decodeUserIdFromToken } from "../../utils/token";
import { Voucher } from "../../models/voucher";
import { tripAmountschema } from '../../utils/validate'

interface Location {
  address: string;
  coordinates: { lat: number, lng: number };
}
interface TripCreation {
    tripId: string;
    userName: string;
    vehicleId: string;
    paymentMethod: string;
    tripAmount: number;
    voucher: string | null;
    driverName: string | null;
    pickupLocation: string;
    destination: string;
    pickupTime: Date | null;
    dropoffTime: Date | null;
    status: 'current' | 'scheduled' | 'completed' | 'cancelled';
}

export const calculateTripAmount = async (req: Request, res: Response) => {
    try {
        const { vehicleName, distance, time } = req.body;

        const { error } = tripAmountschema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: 'Invalid input', error: error.details[0].message });
        }
        // Get the vehicle details
        const vehicle = await Vehicle.findOne({ where: { vehicleName } });

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Calculate the trip amount
        const baseTripAmount = vehicle.baseFare + vehicle.pricePerMIN * time + vehicle.pricePerKMorMI * distance + vehicle.adminCommission;

        // Calculate the trip amounts for all vehicle types
        const tripAmounts = {
            'Datride Vehicle': baseTripAmount,
            'Datride Share': baseTripAmount / 4,
            'Datride Delivery': baseTripAmount,
        };

        // Send the response
        res.status(200).json({ message: 'Trip amounts calculated successfully', tripAmounts });
    } catch (error: any) {
        res.status(500).json({ message: 'An error occurred while calculating the trip amounts', error: error.message });
    }
};

export const BookTrip = async (req: Request, res: Response) => {
    try {
        const tripId = uuidv4();
        const userId = decodeUserIdFromToken(req)

        const { pickupLocation, destination } = req.body;

        // Create a new Trip record
        const trip: TripCreation = {
            tripId,
            userName,
            tripAmount,
            paymentMethod,
            driverName: null,
            pickupLocation,
            destination,
            pickupTime: null,
            dropoffTime: null,
            status: 'pending',
        };
         // Save the Trip to the database
        const newTrip = await trip.create(Trip);
        return res.status(200).json({ message: 'Trip booked successfully', trip: newTrip });
        
    } catch (error) {
        // console.log(error)
        return res.status(500).json({ error: 'An error occurred while booking the Trip' }); 
    }
}

export const confirmTripRequest = async (req: Request, res: Response) => {

    const tripId = uuidv4();
    const userId = decodeUserIdFromToken(req)
    
    const { pickupLocation, destination, vehicleId, paymentMethod, voucher } = req.body;

    // pickupLocation and destination should be objects with 'address' and 'coordinates' properties
    const { address: pickupAddress, coordinates: pickupCoordinates } = pickupLocation;
    const { address: destinationAddress, coordinates: destinationCoordinates } = destination;

    try {
        const vehicleData = await Vehicle.findOne({ where: { vehicleId: vehicleId } });
        if (!vehicleData) {
            return res.status(400).json({ error: "Invalid Trip option" });
        }

        let voucherData;
        let discount = 0;
        if (voucher) {
            // Check if voucher is valid and active
            voucherData = await Voucher.findOne({ where: { couponCode: voucher } });
            if (!voucherData || voucherData.status !== 'active') {
                return res.status(400).json({ error: "Invalid or inactive voucher" });
            }

            // Apply the discount
            discount = voucherData.discount;
        }

        // Calculate the price after discount
        const priceAfterDiscount = vehicleData.pricing - (vehicleData.pricing * discount / 100);

        // Fetch user and driver details
        const userData = await User.findOne({ where: { userId: userId } });
        // const driverData = await Driver.findOne({ where: { driverId: driverId } });

        // Create a new Trip record
        const trip: TripCreation = {
            tripId,
            userName: userData?.firstName + ' ' + userData?.lastName,
            vehicleId,
            paymentMethod,
            voucher,
            driverName: null,
            pickupLocation: {
                address: pickupAddress,
                coordinates: pickupCoordinates
            },
            destination: {
                address: destinationAddress,
                coordinates: destinationCoordinates
            },
            pickupTime: null,
            dropoffTime: null,
            status: 'pending',
            rating: null,
            tripAmount: priceAfterDiscount,
        };

        const newTrip = await trip.create(trip);

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
