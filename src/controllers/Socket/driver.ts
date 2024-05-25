// socketController.ts

import {Driver} from "../../models/drivers";
import {driverSocketMap} from "../../config/socket";

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
}
