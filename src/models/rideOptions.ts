import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface RideOptionAttributes {
    rideOptionid: string;
    capacity: number | null;
    pricing: number;
    serviceType: string;
}

interface RideOptionCreationAttributes extends Optional<RideOptionAttributes, 'rideOptionid'> { }

class RideOption extends Model<RideOptionAttributes, RideOptionCreationAttributes> implements RideOptionAttributes {
    public rideOptionid!: string;
    public capacity!: number | null;
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
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: true,
             validate: {
                isValidCapacity(value: number) {
                    if ((this.serviceType === 'Datride Vehicle' && value !== 4) ||
                        (this.serviceType === 'Datride Share' && value !== 1) ||
                        (this.serviceType === 'Datride Delivery' && value !== null)) {
                        throw new Error('Invalid capacity for the selected service type');
                    }
                },
            },
        },
        pricing: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        serviceType: {
            type: DataTypes.ENUM,
            values: ['Datride Vehicle', 'Datride Share', 'Datride Delivery'],
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'RideOptions',
    })
}

export { RideOption, initRideOption };