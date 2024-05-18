import { Model, Optional, DataTypes, Sequelize } from 'sequelize';

interface CountryAttributes {
    countryId: string;
    name: string;
    email: string;
    currency: string;
    usdConversionRatio: number;
    distanceUnit: string;
    paymentOptionId: string;
}

interface CountryCreationAttributes extends Optional<CountryAttributes, 'countryId'> { }

class Country extends Model<CountryAttributes, CountryCreationAttributes> implements CountryAttributes {
    public countryId!: string;
    public name!: string;
    public email!: string;
    public currency!: string;
    public usdConversionRatio!: number;
    public distanceUnit!: string;
    public paymentOptionId!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associate(models: { [key: string]: any }) {
    Country.belongsToMany(models.VehicleCategory, { through: 'CountryVehicle', foreignKey: 'countryId' });
    Country.belongsTo(models.PaymentOption, { foreignKey: 'paymentOptionId', as: 'paymentoption' });
}
}

const initCountry = (sequelize: Sequelize) => {
    Country.init({
        countryId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        paymentOptionId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'PaymentOptions',
                key: 'paymentOptionId',
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        usdConversionRatio: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        distanceUnit: {
            type: DataTypes.ENUM,
            values: ['KM', 'MI'],
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Countries',
    })

    return Country;
};

export { Country, initCountry };