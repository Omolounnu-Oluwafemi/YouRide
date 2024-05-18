import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface CountryVehicleAttributes {
    countryId: string;
    categoryId: string;
}

interface CountryVehicleCreationAttributes extends Optional<CountryVehicleAttributes, 'countryId' | 'categoryId'> { }

class CountryVehicle extends Model<CountryVehicleAttributes, CountryVehicleCreationAttributes> implements CountryVehicleAttributes {
    public countryId!: string;
    public categoryId!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

const initCountryVehicle = (sequelize: Sequelize) => {
    CountryVehicle.init({
        countryId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: 'countries',
                key: 'countryId'
            }
        },
        categoryId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: 'categories',
                key: 'categoryId'
            }
        }
    }, {
        sequelize,
        modelName: 'CountryVehicle',
    })

    return CountryVehicle;
}

export { CountryVehicle, initCountryVehicle };