import { config } from "dotenv";
import * as geolib from 'geolib';
import { Request, Response } from "express";
import { Trip } from "../../models/trip";
import { User } from "../../models/usersModel";
import { Driver } from "../../models/drivers";
import { VehicleCategory } from "../../models/vehicle";
import { v4 as uuidv4 } from "uuid";
import { Voucher } from "../../models/voucher";
import { io, driverSocketMap } from '../../config/socket';
import { Country } from '../../models/countries';
import axios from 'axios';
import { Sequelize } from 'sequelize-typescript';

config();

io.on('connection', (socket) => {
    socket.on('driverConnected', (driverId) => {
        driverSocketMap.set(driverId, socket.id);
    });
});

async function getETA(startLat: any, startLng: any, endLat: any, endLng: any) {
    const apiKey = process.env.MAP_API
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLat},${startLng}&destination=${endLat},${endLng}&key=${apiKey}`;

    try {
        const response = await axios.get(url);

        const routes = response.data.routes;

        if (routes.length === 0) {
            throw new Error('No route found');
        }

        const leg = routes[0].legs[0];
        const eta = leg.duration.value;

        return eta;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
async function getDrivingDistance(startLat: any, startLng: any, endLat: any, endLng: any) {
    const apiKey=process.env.MAP_API
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLat},${startLng}&destination=${endLat},${endLng}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const routes = response.data.routes;

        if (routes.length === 0) {
            throw new Error('No route found');
        }

        const leg = routes[0].legs[0];
        const distance = leg.distance.value;

        return distance / 1000;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
async function findClosestDriver(pickupLatitude: number, pickupLongitude: number, categoryName: string) {
    try {
        // Fetch all available drivers who are driving the requested vehicle type
        const category = await VehicleCategory.findOne({ where: { categoryName: categoryName } });

        if (!category) {
            return null;
        }

        // Fetch all available drivers for this vehicle
        const drivers = await Driver.findAll({
            where: { categoryId: category.categoryId, isAvailable: true },
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
    } catch (error) {
        console.error('An error occurred while finding the closest driver:', error);
        return null;
    }
}
export const calculateTripAmount = async (categoryName: string, totalDistance: number, country: string, voucher: string | null) => {
    
    const category = await VehicleCategory.findOne({ 
        where: { categoryName }, 
        include: [{
            model: Country,
            where: { name: country }, 
            through: { attributes: [] }, 
        }]
    });

    if (!category) {
        return 0;
    }

    // Check if voucher is valid and active
    let voucherData;
    let discount = 0;
    if (voucher && voucher !== '') {
        voucherData = await Voucher.findOne({ where: { couponCode: voucher } });
        if (!voucherData || voucherData.status !== 'active') {
            throw new Error('Invalid or inactive voucher');
        }
        // Apply the discount
        discount = voucherData.discount;
    }

    // Calculate the trip amount
    const baseTripAmount = category.baseFare + category.pricePerMIN * totalDistance + category.pricePerKMorMI * totalDistance + category.adminCommission;

    // Apply the discount to the base trip amount
    const discountedTripAmount = baseTripAmount - (baseTripAmount * discount / 100);
        
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

    return discountedTripAmount;
};
export const acceptTrip = async (req: Request, res: Response) => {
    const driverId = req.params.driverId;
    const tripId = req.body.tripId;

    try {
        const tripData = await Trip.findOne({ where: { tripId: tripId } });

        if (!tripData) {
            return res.status(404).json({
                status: 404,
                error: "Trip not found"
            });
        }

        const updatedTrip = await Trip.update({ driverId: driverId, status: 'accepted' }, { where: { tripId: tripId } });

        const driverSocketId = driverSocketMap.get(driverId);
        if (driverSocketId) {
            io.to(driverSocketId).emit('tripAccepted', driverId);
        }

        res.status(200).json({
            status: 200,
            Success: "Trip accepted successfully",
            data: updatedTrip
        });
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            status: 500,
            error: "An error occurred while processing your request",
            message: error.message
        });
    };
}
// export const skipTrip = async (req: Request, res: Response) => {
//     try {
//         const { tripId } = req.params;

//         // Find the trip with the given ID
//         const trip = await Trip.findOne({ where: { tripId: tripId } });

//         if (!trip) {
//             return res.status(404).json({
//                 status: 400,
//                 error: 'Trip not found'
//             });
//         }

//         // Find the next closest driver
//         const nextDriver = await findClosestDriver(Number(trip.pickupLatitude), Number(trip.pickupLongitude), trip.categoryName);

//         if (!nextDriver) {
//             return res.status(404).json({
//                 status: 404,
//                 error: 'No available drivers found'
//             });
//         }

//         // Emit the trip to the next driver
//         const driverSocketId = driverSocketMap.get(nextDriver.driverId);
//         if (driverSocketId) {
//             io.to(driverSocketId).emit('newTrip', trip);
//         }

//         return res.status(200).json({
//             status: 200,
//             message: 'Trip skipped successfully',
//             trip
//         });
//     } catch (error) {
//         return res.status(500).json({
//             status: 500,
//             error: 'An error occurred while processing your request'
//         });
//     }
// }
export const startTrip = async (req: Request, res: Response) => {
    try {
        const { tripId } = req.params;
        const { driverId } = req.body;

        // Find the trip with the given ID
        const trip = await Trip.findOne({ where: { tripId: tripId } });

        if (!trip) {
            return res.status(404).json({
                status: 404,
                error: 'Trip not found'
            });
        }

        // Check if the trip is assigned to the current driver
        if (trip.driverId !== driverId) {
            return res.status(403).json({
                status: 403,
                error: 'This trip is not assigned to you'
            });
        }

        // Find the driver with the given ID
        const driver = await Driver.findOne({ where: { driverId: driverId } });

        if (!driver) {
            return res.status(404).json({
                status: 404,
                error: 'Driver not found'
            });
        }

        // Update the driver's status
        driver.isAvailable = false;
        await driver.save();

        // Update the status and pickup time of the trip
        trip.status = 'current';
        trip.pickupTime = new Date();
        await trip.save();

        return res.status(200).json({
            status: 200,
            message: 'Trip started successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
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
            return res.status(404).json({
                status: 404,
                error: 'Trip not found'
            });
        }
        // Update the status of the trip
        trip.status = 'cancelled';
        await trip.save();

        return res.status(200).json({
            status: 200,
            message: 'Trip cancelled successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
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
            return res.status(404).json({
                status: 404,
                error: 'Trip not found'
            });
        }

        // Update the status of the trip
        trip.status = 'completed';
        trip.dropoffTime = new Date(); 
        await trip.save();

        return res.status(200).json({
            status: 200,
            message: 'Trip completed successfully'
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            error: 'An error occurred while processing your request'
        });
    }
}
export const GetAvailableRides = async (req: Request, res: Response) => {
    const { pickupLatitude, pickupLongitude, destinationLatitude, destinationLongitude, userId, voucher } = req.query;

    if (!userId || Array.isArray(userId)) {
        return res.status(400).json({
            status: 400,
            error: 'Invalid user ID'
        });
    }

    try {

        const pickupLongitudeStr = typeof pickupLongitude === 'string' ? pickupLongitude : '';
        const pickupLatitudeStr = typeof pickupLatitude === 'string' ? pickupLatitude : '';
        const destinationLatitudeStr = typeof destinationLatitude === 'string' ? destinationLatitude : '';
        const destinationLongitudeStr = typeof destinationLongitude === 'string' ? destinationLongitude : '';

        const responseData = await fetchAvailableRides(String(userId), pickupLongitudeStr, pickupLatitudeStr, destinationLatitudeStr, destinationLongitudeStr, voucher !== undefined ? String(voucher) : '');

        return res.status(200).json({
            status: 200,
            message: 'Available rides fetched successfully',
            data: responseData
        });
    } catch (error) {
        if ((error as Error).message === 'Invalid or inactive voucher') {
        return res.status(400).json({
            status: 400,
            error: 'Invalid or inactive voucher'
        });
    } else {
        console.log(error)
        return res.status(500).json({
            status: 500,
            error: (error as Error).message
        });
    }
    }
};
export const fetchAvailableRides = async (userId: string, pickupLatitude: string, pickupLongitude: string, destinationLatitude: string, destinationLongitude: string, voucher: string) => {
    const user = await User.findByPk(String(userId));
    if (!user) {
        throw new Error('User not found');
    }
    const country = user.country;

    const vehicleCategories = await VehicleCategory.findAll({
        include: [{
            model: Driver,
            as: 'Drivers', 
            where: { isAvailable: true },
            required: false, 
            include: [{
                model: Country,
                as: 'Country',
                where: { name: country },
                attributes: []
            }],
            attributes: ['driverId',
                [Sequelize.fn('concat', Sequelize.col('firstName'), ' ', Sequelize.col('lastName')),'name'],
                'latitude',
                'longitude']
            }],
            attributes: ['categoryId', 'categoryName', 'baseFare', 'pricePerKMorMI',    'pricePerMIN','carImage']
            });

        if (vehicleCategories.length === 0) {
        throw new Error('No available rides found');
        }

    const responseData = [];

    for (const category of vehicleCategories) {
        let closestDriver = null;
        let shortestETA = null;
        let driverCount = 0;

        for (const driver of category.Drivers) {
         
            const eta = await getETA(pickupLatitude, pickupLongitude, driver.latitude, driver.longitude);
            driverCount++

            if (shortestETA === null || eta < shortestETA) {
                shortestETA = eta;
                closestDriver = driver;
            }
        }
        const totalDistance = (await getDrivingDistance(pickupLatitude, pickupLongitude, destinationLatitude, destinationLongitude)) || 0;

        if (Array.isArray(voucher)) {
            throw new Error('Invalid voucher');
        }

        let tripAmount;
        
        tripAmount = await calculateTripAmount(category.categoryName, totalDistance, country, voucher && voucher !== '' ? voucher : null);
        
         // Only add to responseData if tripAmount is not 0
        if (tripAmount !== 0) {
            let categoryData = {
                totalDistance,
                country,
                categoryId: category.categoryId,
                categoryName: category.categoryName,
                tripAmount,
                driverCount,
                closestDriverId: closestDriver ? closestDriver.driverId.toString() : 'N/A',
                estimatedPickupTime: shortestETA ? shortestETA.toString() : 'N/A',
                closesetDriverLatitude: closestDriver ? closestDriver.latitude : null,
                closesetDriverLongtitude: closestDriver ? closestDriver.longitude : null,
            };

            responseData.push(categoryData);
        }
    }

    return responseData;
};

export const requestRide = async (req: Request, res: Response) => {
    const tripId = uuidv4();
    const userId = req.params.userId;
    
    const { country, pickupLocation, destination, paymentMethod, tripAmount, totalDistance, pickupLatitude, pickupLongitude, destinationLatitude, destinationLongitude } = req.body;

                                                                        
    try {
        const userData = await User.findOne({ where: { userId: userId } });

        if (!userData) {
            return res.status(404).json({
                status: 404,
                error: "User not found"
            });
        }

        const pickupLongitudeStr = String(pickupLongitude);
        const pickupLatitudeStr = String(pickupLatitude);
        const destinationLatitudeStr = String(destinationLatitude);
        const destinationLongitudeStr = String(destinationLongitude);

        const availableRides = await fetchAvailableRides(String(userId), pickupLongitudeStr, pickupLatitudeStr, destinationLatitudeStr, destinationLongitudeStr, '');

        console.log(availableRides);

        if (!availableRides || availableRides.length === 0) {
            return res.status(404).json({
                status: 404,
                error: "No available rides found"
            });
        }
        // Select the first available ride
        const selectedRide = availableRides[0];
        const tripAmountInt = Math.round(tripAmount);

        // Create a new Trip record
        const newTrip = await Trip.create({
            tripId,
            userId: userData.userId, 
            driverId: null,
            userName: userData.firstName + ' ' + userData.lastName,
            paymentMethod,
            totalDistance,
            tripAmount: tripAmountInt,
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
        const driverSocketId = driverSocketMap.get(selectedRide.closestDriverId);

        if (driverSocketId) {
            // Fetch the closest driver's details
            const closestDriver = await Driver.findOne({ where: { driverId: selectedRide.closestDriverId } });

            if (!closestDriver) {
                return res.status(404).json({
                    status: 404,
                    error: "Closest driver not found"
                });
            }

            // Add the closest driver's details to the newTrip object
            const tripWithDriver = { ...newTrip.dataValues, driver: closestDriver };
            
            io.to(driverSocketId).emit('newTrip', tripWithDriver);

            // Set a timeout for driver acceptance
            const timeoutId = setTimeout(() => {
                res.status(500).json({
                    status: 500,
                    error: "Our drivers are not available right now, please try again"
                });
            }, 30000); 
            // Listen for driver acceptance
            io.on('tripAccepted', (driverId: string) => {
                if (driverId === selectedRide.closestDriverId) {
                    clearTimeout(timeoutId);
                    res.status(201).json({
                        status: 201,
                        Success: "Trip order created successfully",
                        data: tripWithDriver
                    });
                }
            });
        } else {
            res.status(500).json({
                status: 500,
                error: "No driver available to accept the trip"
            });
        }
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            status: 500,
            error: "An error occurred while processing your request",
            message: error.message
        });
    };
}