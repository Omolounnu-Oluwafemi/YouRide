import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface RideOptionAttributes {
    rideOptionid: string;
    vehicleType: string;
    capacity: number;
    pricing: number;
    serviceType: string;
}

interface RideOptionCreationAttributes extends Optional<RideOptionAttributes, 'rideOptionid'> { }

class RideOption extends Model<RideOptionAttributes, RideOptionCreationAttributes> implements RideOptionAttributes {
    public rideOptionid!: string;
    public vehicleType!: string;
    public capacity!: number;
    public pricing!: number;
    public serviceType!: string;
}

const initRideOption = (sequelize: Sequelize) => {
    RideOption.init({
        rideOptionid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        vehicleType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        pricing: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        serviceType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'RideOption',
    })
}

export { RideOption, initRideOption };