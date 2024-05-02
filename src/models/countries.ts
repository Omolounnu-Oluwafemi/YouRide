import { Model, Optional, DataTypes, Sequelize } from 'sequelize';

interface CountryAttributes {
    countryId: string;
    name: string;
    email: string;
    currency: string;
    usdConversionRatio: number;
    distanceUnit: string;
    paymentOption: string;
}

interface CountryCreationAttributes extends Optional<CountryAttributes, 'countryId'> { }

class Country extends Model<CountryAttributes, CountryCreationAttributes> implements CountryAttributes {
    public countryId!: string;
    public name!: string;
    public email!: string;
    public currency!: string;
    public usdConversionRatio!: number;
    public distanceUnit!: string;
    public paymentOption!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

const initCountry = (sequelize: Sequelize) => {
    Country.init({
        countryId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
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
        paymentOption: {
            type: DataTypes.ENUM,
            values: ['Stripe Payment', 'Paystack Payment'],
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Countries',
        
    })
};

export { Country, initCountry };