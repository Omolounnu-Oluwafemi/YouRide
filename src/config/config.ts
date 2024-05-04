import { Sequelize } from 'sequelize';
import { User, initUser } from '../models/usersModel';
import { Driver, initDriver } from '../models/drivers';
import { Admin, initAdmin } from '../models/admin';
import { Vehicle, initVehicle } from '../models/vehicle';
import { Trip, initTrip } from '../models/trip';
import { Voucher, initVoucher } from '../models/voucher';
import { Country, initCountry } from '../models/countries';
import { CountryVehicle, initCountryVehicle } from '../models/countryVehicle'; 

const database = process.env.DB_NAME || 'postgres';
const username = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || '@August1908dev';
const host = process.env.DB_HOST || 'localhost';
const dialect = 'postgres';

export const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});

initUser(sequelize);
initDriver(sequelize);
initVehicle(sequelize);
initAdmin(sequelize);
initVoucher(sequelize);
initTrip(sequelize);
initCountry(sequelize);
initCountryVehicle(sequelize);


// Define associations
User.hasMany(Trip, { foreignKey: 'userId' });
Driver.hasMany(Trip, { foreignKey: 'driverId' });
Vehicle.hasMany(Trip, { foreignKey: 'vehicleId' });
Vehicle.hasMany(Driver, { foreignKey: 'vehicleId' });
Trip.belongsTo(User, { foreignKey: 'userId' });
Trip.belongsTo(Driver, { foreignKey: 'driverId' });
Trip.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
Driver.belongsTo(Vehicle, { foreignKey: 'driverId', as: 'vehicle' });
Country.belongsToMany(Vehicle, { through: CountryVehicle, foreignKey: 'countryId', as: 'vehicles' }); // new association
Vehicle.belongsToMany(Country, { through: CountryVehicle, foreignKey: 'vehicleId', as: 'countries' }); // new association

