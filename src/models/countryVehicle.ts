import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface CountryVehicleAttributes {
    countryId: string;
    vehicleId: string;
}

interface CountryVehicleCreationAttributes extends Optional<CountryVehicleAttributes, 'countryId' | 'vehicleId'> { }

class CountryVehicle extends Model<CountryVehicleAttributes, CountryVehicleCreationAttributes> implements CountryVehicleAttributes {
    public countryId!: string;
    public vehicleId!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

const initCountryVehicle = (sequelize: Sequelize) => {
    CountryVehicle.init({
        countryId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: 'Countries',
                key: 'countryId'
            }
        },
        vehicleId: {
            type: DataTypes.UUID,
            primaryKey: true,
            references: {
                model: 'Vehicles',
                key: 'vehicleId'
            }
        }
    }, {
        sequelize,
        modelName: 'CountryVehicles',
    })
}

export { CountryVehicle, initCountryVehicle };