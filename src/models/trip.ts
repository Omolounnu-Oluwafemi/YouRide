import { DataTypes, Model, Optional, Sequelize, BelongsToGetAssociationMixin } from 'sequelize';
import { User } from './usersModel';
import { Driver } from './drivers'
import { VehicleCategory } from './vehicle';
import { Voucher } from './voucher';

    
interface TripAttributes {
    tripId: string;
    driverId: string | null;
    userId: string;
    userName: string;
    driverName: string | null;
    // categoryName: string;
    country: string;
    // categoryId: string | null;
    paymentMethod: string;
    tripAmount: number;
    pickupLocation: string;
    destination: string;
    pickupLatitude: string;
    pickupLongitude: string;
    destinationLatitude: string;
    destinationLongitude: string;
    totalDistance: number;
    pickupTime: Date | null;
    dropoffTime: Date | null;
    status: string;
}

export interface TripCreationAttributes extends Optional<TripAttributes, 'tripId'> {}

class Trip extends Model<TripAttributes, TripCreationAttributes> implements TripAttributes {
    public tripId!: string;
    public userId!: string;
    public driverId!: string | null;
    public userName!: string;
    public driverName!: string | null;
    // public categoryName!: string;
    public country!: string;
    // public categoryId!: string | null;
    public paymentMethod!: string;
    public tripAmount!: number;
    public voucherId!: string | null;
    public pickupLocation!:  string;
    public destination!: string;
    public pickupLatitude!: string;
    public pickupLongitude!: string;
    public destinationLatitude!: string;
    public destinationLongitude!: string;
    public totalDistance!: number;
    public pickupTime!: Date | null;
    public dropoffTime!: Date | null;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
        
    public getDriver!: BelongsToGetAssociationMixin<Driver>;
    public getUser!: BelongsToGetAssociationMixin<User>;
    public getVehicle!: BelongsToGetAssociationMixin<VehicleCategory>;
    public getVoucher!: BelongsToGetAssociationMixin<Voucher>;

    public static associate(models: { [key: string]: any }) {
    Trip.belongsTo(models.User, { foreignKey: 'userId', as: 'users' });
    Trip.belongsTo(models.Driver, { foreignKey: 'driverId', as: 'drivers' });
    Trip.belongsTo(models.Vehicle, { foreignKey: 'categoryId', as: 'vehicles' });
    Trip.belongsTo(models.Voucher, { foreignKey: 'categoryId', as: 'vouchers' });
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
            //  categoryName: {
            //     type: DataTypes.STRING,
            //     allowNull: false
            // },
            userName: {
                type: DataTypes.STRING,
                allowNull: true
            },
            // categoryId: {
            //     type: DataTypes.UUID,
            //     allowNull: true,
            //     references: {
            //         model: 'VehicleCategories',
            //         key: 'categoryId'
            //     }
            // },
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
            pickupLatitude: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            pickupLongitude: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            destinationLatitude: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            destinationLongitude: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            totalDistance: {
                type: DataTypes.FLOAT,
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
        },
        {
            sequelize,
            tableName: 'Trips',
        },
    );

    return Trip;
}

export { Trip, initTrip };