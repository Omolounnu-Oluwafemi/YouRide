import { DataTypes, Model, Optional, Sequelize, BelongsToGetAssociationMixin } from 'sequelize';
import { User } from './usersModel';
import { Driver } from './drivers'


interface RideAttributes {
  rideId: string;
  userId: string;
  driverId: string | null;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: Date | null;
  dropoffTime: Date | null;
  status: string;
}

interface RideCreationAttributes extends Optional<RideAttributes, 'rideId'> {}
class Ride extends Model<RideAttributes, RideCreationAttributes> implements RideAttributes {
    public rideId!: string;
    public driverId!: string | null;
    public userId!: string;
    public pickupLocation!: string;
    public dropoffLocation!: string;
    public pickupTime!: Date | null;
    public dropoffTime!: Date | null;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
        
    public getDriver!: BelongsToGetAssociationMixin<Driver>;
    public getUser!: BelongsToGetAssociationMixin<User>;

    public static associate(models: { [key: string]: any }) {
    Ride.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Ride.belongsTo(models.Driver, { foreignKey: 'driverId', as: 'driver' });
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
            driverId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: 'Driver',
                    key: 'driverId'
                }
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'User',
                    key: 'userId'
                }
            },
            pickupLocation: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            dropoffLocation: {
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
            status: {
                type: DataTypes.ENUM,
                values: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'Rides',
        },
    );
}

export { Ride, initRide };