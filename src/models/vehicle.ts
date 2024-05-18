import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface VehicleAttributes {
    categoryId: string;
    driverId: string | null;
    country: string;
    baseFare: number;
    pricePerKMorMI: number;
    pricePerMIN: number;
    adminCommission: number;
    status: string;
    categoryName: string;
    carImage: string;
    documentImage: string;
    isSurge: boolean;
    surgeStartTime: string;
    surgeEndTime: number;
    surgeType: string;
    isDocVerified: boolean;
}

interface VehicleCreationAttributes extends Optional<VehicleAttributes, 'vehicleId'> { }

class VehicleCategory extends Model<VehicleAttributes, VehicleCreationAttributes> implements VehicleAttributes {
    public vehicleId!: string;
    public driverId!: string | null;
    public country!: string;
    public baseFare!: number;
    public pricePerKMorMI!: number;
    public pricePerMIN!: number;
    public adminCommission!: number;
    public status!: string;
    public vehicleCategory!: string;
    public vehicleName!: string;
    public carImage!: string;
    public documentImage!: string;
    public isSurge!: boolean;
    public surgeStartTime!: string;
    public surgeEndTime!: number;
    public surgeType!: string;
    public isDocVerified!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associate(models: { [key: string]: any }) {
    VehicleCategory.belongsToMany(models.Country, { through: models.CountryVehicle, foreignKey: 'vehicleId', as: 'countries' });
    VehicleCategory.hasMany(models.Trip, { foreignKey: 'vehicleId', as: 'trips' });
    VehicleCategory.hasMany(models.Driver, { foreignKey: 'driverId', as: 'drivers' });
  }
}

const initVehicleCategory = (sequelize: Sequelize) => {
    VehicleCategory.init({
        categoryId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        categoryName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
         driverId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Drivers',
                key: 'driverId'
            }
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        baseFare: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        pricePerKMorMI: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        pricePerMIN: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        adminCommission: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM,
            values: ['Active', 'Inactive'],
            allowNull: false,
            defaultValue: 'Active',
        },
        isSurge: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        surgeStartTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        surgeEndTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        surgeType: {
            type: DataTypes.ENUM,
            values: ['Percentage', 'Fixed'],
            allowNull: true,
        },
        carImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        documentImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isDocVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
    }, {
        sequelize,
        modelName: 'Vehicles',
    })
}

export { VehicleCategory, initVehicleCategory };