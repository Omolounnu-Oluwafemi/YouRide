import { DataTypes, Model, Optional, Sequelize, BelongsToGetAssociationMixin } from 'sequelize';
import { User } from './usersModel';
import { Driver } from './drivers'
import { Vehicle } from './vehicle';
import { Voucher } from './voucher';

    
interface TripAttributes {
    tripId: string;
    driverId: string;
    userId: string;
    userName: string;
    driverName: string | null;
    country: string;
    vehicleId: string;
    paymentMethod: string;
    tripAmount: number;
    voucherId: string | null;
    pickupLocation: string;
    destination: string;
    totalDistance: string;
    pickupTime: Date | null;
    dropoffTime: Date | null;
    status: string;
}

interface TripCreationAttributes extends Optional<TripAttributes, 'tripId'> {}

class Trip extends Model<TripAttributes, TripCreationAttributes> implements TripAttributes {
    public tripId!: string;
    public userId!: string;
    public driverId!: string;
    public userName!: string;
    public driverName!: string | null;
    public country!: string;
    public vehicleId!: string;
    public paymentMethod!: string;
    public tripAmount!: number;
    public voucherId!: string | null;
    public pickupLocation!:  string;
    public destination!: string;
    public totalDistance!: string;
    public pickupTime!: Date | null;
    public dropoffTime!: Date | null;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
        
    public getDriver!: BelongsToGetAssociationMixin<Driver>;
    public getUser!: BelongsToGetAssociationMixin<User>;
    public getVehicle!: BelongsToGetAssociationMixin<Vehicle>;
    public getVoucher!: BelongsToGetAssociationMixin<Voucher>;

    public static associate(models: { [key: string]: any }) {
    Trip.belongsTo(models.User, { foreignKey: 'userId', as: 'users' });
    Trip.belongsTo(models.Driver, { foreignKey: 'driverId', as: 'drivers' });
    Trip.belongsTo(models.Vehicle, { foreignKey: 'vehicleId', as: 'vehicles' });
    Trip.belongsTo(models.Voucher, { foreignKey: 'voucherId', as: 'vouchers' });
  }
}

const initTrip = (sequelize: Sequelize) => {
    Trip.init(
        {
            tripId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            driverId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'Drivers',
                    key: 'driverId'
                }
            },
            driverName: {
                type: DataTypes.STRING,
                allowNull: true
            },
            userName: {
                type: DataTypes.STRING,
                allowNull: true
            },
            vehicleId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Vehicles',
                    key: 'vehicleId'
                }
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'userId'
                }
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            pickupLocation: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            destination: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            totalDistance: {
                type: DataTypes.STRING,
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
            tripAmount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
             paymentMethod: {
                type: DataTypes.ENUM,
                values: ['Cash', 'Card Payment', 'Datride Wallet'],
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM,
                values: ['current', 'scheduled', 'completed' , 'cancelled'],
                allowNull: false,
            },
            voucherId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'Trips',
        },
    );
}

export { Trip, initTrip };