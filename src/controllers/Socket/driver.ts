// socketController.ts

import {Driver} from "../../models/drivers";
import { io, driverSocketMap } from "../../config/socket";
import { VehicleCategory } from "../../models/vehicle";
import { Trip } from "../../models/trip";

export class DriverSocketController {
    static async updateDriverStatusAndLocation(driverId: string, isAvailable: boolean, latitude: string, longitude: string, socketId: string | null = null) {
        try {
            const updated = await Driver.update({
                isAvailable: isAvailable,
                latitude: latitude,
                longitude: longitude,
            }, { where: { driverId } });

            if (isAvailable && socketId) {
                driverSocketMap.set(driverId, socketId);
            } else {
                driverSocketMap.delete(driverId);
            }

            if (!updated) {
                console.log('Failed to update driver status and location');
            } else {
                console.log('Driver status and location updated successfully');
            }
        } catch (error) {
            console.error('Error updating driver location:', error);
        }
    }
    static async updateDriverAvailability(driverId: string, isAvailable: boolean, socketId: string | null = null) {
        try {
            const driver = await Driver.findOne({ where: { driverId } });
            if (driver) {
                await Driver.update({ isAvailable: isAvailable }, { where: { driverId } });
                if (isAvailable && socketId) {
                    driverSocketMap.set(driverId, socketId);
                } else {
                    driverSocketMap.delete(driverId);
                }
            } else {
                console.error('Driver not found');
            }
        } catch (error) {
            console.error('Error updating driver availability:', error);
        }
    }
    static async updateDriverLocation(driverId: string, latitude: string, longitude: string) {
        try {
            await Driver.update({ latitude: latitude, longitude: longitude }, { where: { driverId } });
        } catch (error) {
            console.error('Error updating driver location:', error);
        }
    }

static async updateTripWithDriverDetails(tripId: string, driverId: string) {
    try {
        const trip = await Trip.findOne({ where: { tripId } });
        if (!trip) {
            return {
                status: 404,
                message: 'Trip not found',
            };
        }

        const driver = await Driver.findOne({ 
            where: { driverId },
            include: [{
                model: VehicleCategory,
                as: 'vehicleCategory',
                attributes: ['carImage', 'vehicleManufacturer', 'licensePlate', 'vehicleColor']
            }]
        });
        if (!driver) {
            return {
                status: 404,
                message: 'Driver not found',
            };
        }

        await Trip.update({
            driverId: driver.driverId,
            driverName: driver.firstName + ' ' + driver.lastName,
            status: 'current',
        }, { where: { tripId } });

        // Retrieve the updated trip
        const updatedTrip = await Trip.findOne({ where: { tripId } });

        const driverSocketId = driverSocketMap.get(driverId);
        if (driverSocketId && updatedTrip) {
            // Emit the driver details from the updated trip
            io.to(driverSocketId).emit('tripAccepted', {
                driverId: updatedTrip.driverId,
                driverName: updatedTrip.driverName,
                driverRating: driver.driverRating,
                licensePlate: driver.licensePlate,
                vehicleColor: driver.vehicleColor,
                vehicleManufacturer: driver.vehicleManufacturer,
                carImage: driver.vehicleCategory.carImage
            });
        }

        return {
            status: 'success',
            message: 'Trip updated with driver details',
        };
    } catch (error) {
        console.error('Error updating trip with driver details:', error);
        return {
            status: 'error',
            message: 'Error updating trip with driver details',
        };
    }
}
}
