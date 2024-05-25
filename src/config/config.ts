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

// Create Master details in the Db
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
const createDefaultPaymentOption = async () => {
  const defaultPaymentOption = {
    paymentOptionId: uuidv4(),
    paymentName: 'Stripe Payment', 
    privateKey: 'yourPrivateKeyHere',
    publicKey: 'yourPublicKeyHere',
    paymentAvailable: true 
  };

  const [paymentOption, created] = await PaymentOptions.findOrCreate({
    where: { paymentName: defaultPaymentOption.paymentName },
    defaults: defaultPaymentOption
  });

  if (created) {
    console.log('Default payment option created');
  } else {
    console.log('Default payment option already exists');
  }

  return paymentOption;
};
const createDefaultCountry = async () => {
  const paymentOption = await createDefaultPaymentOption();

  const defaultCountry = {
    countryId: uuidv4(),
    name: 'Nigeria',
    email: 'nigeria@datride.com',
    currency: 'NGN',
    usdConversionRatio: 0.0026, 
    distanceUnit: 'KM',
    paymentOptionId: paymentOption.paymentOptionId 
  };

  const [country, countryCreated] = await Country.findOrCreate({
    where: { name: defaultCountry.name },
    defaults: defaultCountry
  });

  if (countryCreated) {
    console.log('Default country created');
  } else {
    console.log('Default country already exists');
  }

  return country
};
const createDefaultVehicleCategory = async () => {
  if (!VehicleCategory) {
    console.error('VehicleCategory model is not defined');
    return;
  }

  const country = await createDefaultCountry(); 

  const defaultVehicleCategory = {
    baseFare: 100,
    pricePerKMorMI: 10,
    pricePerMIN: 5,
    adminCommission: 20,
    status: 'Active',
    categoryName: 'Taxi Driver',
    vehicleName: 'Datride Vehicle',
    carImage: 'defaultCarImage.png',
    documentImage: 'defaultDocumentImage.png',
    isSurge: false,
    surgeStartTime: '20:00:00',
    surgeEndTime: '23:00:00',
    surgeType: 'Percentage',
    isDocVerified: false
  };

  const [vehicleCategory, vehicleCategoryCreated] = await VehicleCategory.findOrCreate({
    where: { categoryName: defaultVehicleCategory.categoryName },
    defaults: defaultVehicleCategory
  });

  if (vehicleCategoryCreated) {
    console.log('Default vehicle category created');
  } else {
    console.log('Default vehicle category already exists');
  }

  await vehicleCategory.addCountry(country);
};

async function initialize() {
  await initPaymentOption(sequelize);
  await initUser(sequelize);
  await initDriver(sequelize);
  await initVehicleCategory(sequelize);
  await initAdmin(sequelize);
  await initVoucher(sequelize);
  await initTrip(sequelize);
  await initCountry(sequelize);
  await initCountryVehicle(sequelize);

  defineAssociations();

  await sequelize.sync({ force: false });

  await createSuperAdmin();
  await createDefaultPaymentOption();
  await createDefaultCountry();
  await createDefaultVehicleCategory();
}

initialize().catch(console.error);