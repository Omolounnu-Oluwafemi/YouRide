import { Sequelize } from 'sequelize';
import { User, initUser } from '../models/usersModel';
import { Driver, initDriver } from '../models/drivers';
import { Admin, initAdmin } from '../models/admin';
import { Ride, initRide } from '../models/ride';
import { RideOption, initRideOption } from '../models/rideOptions';
import { Voucher, initVoucher } from '../models/voucher';

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
initAdmin(sequelize);
initRide(sequelize);
initRideOption(sequelize);
initVoucher(sequelize);

// Then set up associations
User.associate(sequelize.models);
Driver.associate(sequelize.models);
Ride.associate(sequelize.models);
