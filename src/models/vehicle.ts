import { Model, DataTypes, Optional, Sequelize, BelongsToManyAddAssociationMixin } from 'sequelize';
import { Country } from './countries';

interface VehicleAttributes {
    categoryId: string;
    baseFare: number;
    pricePerKMorMI: number;
    pricePerMIN: number;
    adminCommission: number;
    status: string;
    categoryName: string;
    vehicleName: string;
    carImage: string;
    documentImage: string;
    isSurge: boolean;
    surgeStartTime: string;
    surgeEndTime: string;
    surgeType: string;
    isDocVerified: boolean;
}

interface VehicleCreationAttributes extends Optional<VehicleAttributes, 'categoryId'> { }

interface VehicleInstance extends Model<VehicleAttributes, VehicleCreationAttributes>, VehicleAttributes {
    addCountry: BelongsToManyAddAssociationMixin<Country, string>;
}

class VehicleCategory extends Model<VehicleAttributes, VehicleCreationAttributes> implements VehicleAttributes {
    public categoryId!: string;
    public baseFare!: number;
    public pricePerKMorMI!: number;
    public pricePerMIN!: number;
    public adminCommission!: number;
    public status!: string;
    public categoryName!: string;
    public vehicleName!: string;
    public carImage!: string;
    public documentImage!: string;
    public isSurge!: boolean;
    public surgeStartTime!: string;
    public surgeEndTime!: string;
    public surgeType!: string;
    public isDocVerified!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public addCountry!: BelongsToManyAddAssociationMixin<Country, string>;
    vehicleId: any;
    Drivers: any;
    public static associate(models: { [key: string]: any }) {
    VehicleCategory.hasMany(models.Trip, { foreignKey: 'categoryId', as: 'trips' });
    VehicleCategory.hasMany(models.Driver, { foreignKey: 'categoryId', as: 'drivers' });
    VehicleCategory.belongsToMany(models.Country, { through: 'CountryVehicle', foreignKey: 'categoryId' });
  }
}

const initVehicleCategory = (sequelize: Sequelize) => {
    VehicleCategory.init({
        categoryId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
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
        categoryName: {
            type: DataTypes.ENUM,
            values: ['Taxi Driver', 'Bus Driver', 'Delivery Driver'],
            allowNull: false,
        },
        vehicleName: {
            type: DataTypes.ENUM,
            values: ['Datride Vehicle', 'Datride Share', 'Datride Delivery'],
            allowNull: false,
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
        modelName: 'VehicleCategories',
    })

    return VehicleCategory;
}

export { VehicleCategory, initVehicleCategory };