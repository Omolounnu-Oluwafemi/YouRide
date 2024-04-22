import { DataTypes, Model, Optional, Sequelize, BelongsToGetAssociationMixin } from 'sequelize';
import { User } from './usersModel';
import { Driver } from './drivers'
import { Vehicle } from './vehicle';
import { Voucher } from './voucher';

interface Location {
  address: string;
  coordinates: { lat: number, lng: number };
}
    
interface RideAttributes {
    rideId: string;
    userName: string;
    driverName: string | null;
    vehicleId: string;
    paymentMethod: string;
    rideAmount: number;
    voucherId: string | null;
    pickupLocation: Location;
    destination: Location;
    pickupTime: Date | null;
    dropoffTime: Date | null;
    status: string;
    rating: number | null;
}

interface RideCreationAttributes extends Optional<RideAttributes, 'rideId'> {}

class Ride extends Model<RideAttributes, RideCreationAttributes> implements RideAttributes {
    public rideId!: string;
    public userName!: string;
    public driverName!: string | null;
    public vehicleId!: string;
    public paymentMethod!: string;
    public rideAmount!: number;
    public voucherId!: string | null;
    public pickupLocation!: Location;
    public destination!: Location;
    public pickupTime!: Date | null;
    public dropoffTime!: Date | null;
    public status!: string;
    public rating!: number | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
        
    public getDriver!: BelongsToGetAssociationMixin<Driver>;
    public getUser!: BelongsToGetAssociationMixin<User>;
    public getVehicle!: BelongsToGetAssociationMixin<Vehicle>;
    public getVoucher!: BelongsToGetAssociationMixin<Voucher>;

    public static associate(models: { [key: string]: any }) {
    Ride.belongsTo(models.User, { foreignKey: 'userId', as: 'users' });
    Ride.belongsTo(models.Driver, { foreignKey: 'driverId', as: 'drivers' });
    Ride.belongsTo(models.Vehicle, { foreignKey: 'vehicleId', as: 'vehicles' });
    Ride.belongsTo(models.Voucher, { foreignKey: 'voucherId', as: 'vouchers' });
  }
}

const initRide = (sequelize: Sequelize) => {
    Ride.init(
        {
            rideId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            driverName: {
                type: DataTypes.STRING,
                allowNull: true,
                references: {
                    model: 'Driver',
                    key: 'driverId'
                }
            },
            vehicleId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Vehicle',
                    key: 'vehicleId'
                }
            },
            userName: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'userId'
                }
            },
            pickupLocation: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            destination: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            pickupTime: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            dropoffTime: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            rideAmount: {
                type: DataTypes.NUMBER,
                allowNull: false,
            },
             paymentMethod: {
                type: DataTypes.ENUM,
                values: ['Cash', 'Card Payment', 'Datride Wallet'],
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM,
                values: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
                allowNull: false,
            },
            rating: {
                type: DataTypes.ENUM,
                values: ['1', '2', '3', '4', '5'],
                allowNull: true,
            },
            voucherId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'Rides',
        },
    );
}

export { Ride, initRide };