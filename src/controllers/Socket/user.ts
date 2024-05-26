import { Trip } from "../../models/trip";
import { User } from "../../models/usersModel";
import { io } from "../../config/socket";
import { v4 as uuidv4 } from "uuid";

export class UserSocketController {
    static async requestRide(userId: string, pickupLocation: string, destination: string, paymentMethod: string, tripAmount: number, totalDistance: number, pickupLatitude: string, pickupLongitude: string, destinationLatitude: string, destinationLongitude: string, socketId: string | null = null) {
        try {
            const user = await User.findOne({ where: { userId } });
            if (!user) {
                throw new Error('User not found');
            }

            const tripId = uuidv4();
            let newTrip = await Trip.create({
                tripId,
                userId: user.userId,
                userName: user.firstName + ' ' + user.lastName,
                country: user.country,
                pickupLocation,
                destination,
                paymentMethod,
                tripAmount,
                totalDistance,
                pickupLatitude,
                pickupLongitude,
                destinationLatitude,
                destinationLongitude,
                status: 'scheduled',
            });

            // Create a new object that includes all properties of newTrip.dataValues and userRating
            const newTripWithRating = { ...newTrip.dataValues, userRating: user.userRating };

            if (socketId) {
                io.to(socketId).emit('newTrip', newTripWithRating);
            } else {
                io.emit('newTrip', newTripWithRating);
            }

            return {
                status: 'success',
                message: 'Trip request created successfully',
                trip: newTripWithRating,
            };
        } catch (error) {
            console.error('Error creating trip request:', error);
            return {
                status: 'error',
                message: 'Error creating trip request',
            };
        }
    }
}