import { Request, Response } from "express";
import { Ride } from "../../models/ride";
import { User } from "../../models/usersModel";
import { Driver } from "../../models/drivers";
import { Vehicle } from "../../models/vehicle";
import { v4 as uuidv4 } from "uuid";
import { decodeUserIdFromToken } from "../../utils/token";
import { Voucher } from "../../models/voucher";

interface Location {
  address: string;
  coordinates: { lat: number, lng: number };
}
interface RideCreation {
    rideId: string;
    userName: string;
    vehicleId: string;
    paymentMethod: string;
    rideAmount: number;
    voucher: string | null;
    driverName: string | null;
    pickupLocation: Location;
    destination: Location;
    pickupTime: Date | null;
    dropoffTime: Date | null;
    status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
    rating: number | null;
}

export const BookRide = async (req: Request, res: Response) => {
    try {
        const rideId = uuidv4();
        const userId = decodeUserIdFromToken(req)

        const { pickupLocation, destination } = req.body;

        // Create a new ride record
        const ride: RideCreation = {
            rideId,
            userId,
            driverId: null,
            pickupLocation,
            destination,
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

export const confirmRideRequest = async (req: Request, res: Response) => {

    const rideId = uuidv4();
    const userId = decodeUserIdFromToken(req)
    
    const { pickupLocation, destination, vehicleId, paymentMethod, voucher } = req.body;

    // pickupLocation and destination should be objects with 'address' and 'coordinates' properties
    const { address: pickupAddress, coordinates: pickupCoordinates } = pickupLocation;
    const { address: destinationAddress, coordinates: destinationCoordinates } = destination;

    try {
        const vehicleData = await Vehicle.findOne({ where: { vehicleId: vehicleId } });
        if (!vehicleData) {
            return res.status(400).json({ error: "Invalid ride option" });
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

        // Create a new ride record
        const ride: RideCreation = {
            rideId,
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
            rideAmount: priceAfterDiscount,
        };

        const newRide = await Ride.create(ride);

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
            Success: "Ride order created successfully",
            data: newRide
        });
    } catch (error: any) {
        res.status(500).json({
            error: "An error occurred while processing your request",
            message: error.message
        });
    };
}
