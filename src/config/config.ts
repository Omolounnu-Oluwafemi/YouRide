require('dotenv').config();
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";
import { Dialect, Sequelize } from 'sequelize';
import { User, initUser } from '../models/usersModel';
import { Driver, initDriver } from '../models/drivers';
import { Admin, initAdmin } from '../models/admin';
import { Trip, initTrip } from '../models/trip';
import { VehicleCategory, initVehicleCategory } from '../models/vehicle';
import { Voucher, initVoucher } from '../models/voucher';
import { Country, initCountry } from '../models/countries';
import { CountryVehicle, initCountryVehicle } from '../models/countryVehicle'; 
import { PaymentOptions, initPaymentOption } from '../models/paymentOption'; 

const database = process.env.DB_NAME || '';
const username = process.env.DB_USER || '';
const password = process.env.DB_PASSWORD || '';
const host = process.env.DB_HOST || '';
const dialect = process.env.DB_DIALECT as Dialect;

export const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: dialect as Dialect,
});


initPaymentOption(sequelize);
initUser(sequelize);
initDriver(sequelize);
initVehicleCategory(sequelize);
initAdmin(sequelize);
initVoucher(sequelize);
initTrip(sequelize);
initCountry(sequelize);
initCountryVehicle(sequelize);

function defineAssociations() {
    User.hasMany(Trip, { foreignKey: 'userId' });
    Driver.hasMany(Trip, { foreignKey: 'driverId' });
    VehicleCategory.hasMany(Trip, { foreignKey: 'categoryId' });
    VehicleCategory.hasMany(Driver, { foreignKey: 'categoryId' });
    Trip.belongsTo(User, { foreignKey: 'userId' });
    Trip.belongsTo(Driver, { foreignKey: 'driverId' });
    Trip.belongsTo(VehicleCategory, { foreignKey: 'categoryId', as: 'vehicleCategories' });
    Driver.belongsTo(VehicleCategory, { foreignKey: 'categoryId', as: 'vehicleCategories' });
    Country.belongsToMany(VehicleCategory, { 
      through: CountryVehicle, 
      foreignKey: 'countryId', 
      otherKey: 'categoryId' 
    });
    VehicleCategory.belongsToMany(Country, { 
      through: CountryVehicle, 
      foreignKey: 'categoryId', 
      otherKey: 'countryId' 
    });
    Country.hasMany(Driver, { foreignKey: 'countryId' });
    Driver.belongsTo(Country, { foreignKey: 'countryId' });
}

defineAssociations();

// Create Super Admin
const createSuperAdmin = async () => {
  const superAdminEmail = 'superadmin@datride.com';
  const superAdminPassword = '@datrideSuperAdmin1234!';

  const superAdmin = await Admin.findOne({ where: { email: superAdminEmail, role: 'Super Admin' } });

  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
    await Admin.create({
      adminId: uuidv4(),
      firstName: 'DatRide',
      lastName: 'Super Admin',
      email: superAdminEmail,
      role: 'Super Admin',
      password: hashedPassword,
      isActive: true,
    });
    console.log('Super Admin created');
  } else {
    console.log('Super Admin already exists');
  }
};

// Call the function after initializing all models and defining associations
createSuperAdmin().catch(console.error);